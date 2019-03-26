const bcrypt       = require('bcrypt')
const jwt          = require('jsonwebtoken')
const DBConnector  = require('../db/db')
const Message      = require('../msg/msg')

var app_db            = null;
var local_settings    = null;

async function authenticate(domain, username, password) {
  console.log("Authenticating: " + username)
  if (domain && username && password) {
    // Get Domain
    const domains = await app_db.collection('users').find({domain: domain}).toArray()
    if (domains.length > 0) {
      const myDomain = domains[0]

      // Create DB connection
      const db = new DBConnector()
      db.setTimestamp(true)
      const response = await db.initAsync(myDomain.db_username, myDomain.db_password, myDomain.db_host)
      if (response.error) {
        console.log("! Error")
      } else {
        // Get user
        const users = await db.getUserFromEmailAsync(username, null)
        if (users.result.length === 1) {
          var hash = users.result[0].password
          // Load hash from your password DB.
          const result = await bcrypt.compare(password, hash)
          if (result === true) {
            // Valid user. Pass.
            console.log("Successful authentication")
            return {
              database: db,
              authUser: users.result[0]
            }
          } else {
            console.log("!> Passwords did not validate.")
          }
        } else {
          console.log("!> No user or multiple users found: Users " + users.result.length)
        }
      }
    } else {
      console.log("!> No domain found.")
    }
  }
  return null
}

function generateToken(payload) {
  return jwt.sign(payload, local_settings.authentication.secret);
}

// ===========================================================
// API
// ===========================================================
module.exports = {
  init (_app_db, _local_settings) {
    app_db = _app_db;
    local_settings = _local_settings;
  },

  authenticateRequest: async (req) => {
    const auth = await authenticate(req.body.domain, req.body.username, req.body.password)
    if (auth !== null) {
      // Store key values in token.
      var token = generateToken({
        domain: req.body.domain,
        id: auth.authUser.id,
        name: auth.authUser.name,
        time: new Date().getTime()
      })
      return Message.success('Access granted', {
        'token': token,
        'id': auth.authUser.id,
        'name': auth.authUser.name
      })
    } else {
      return Message.error('Access denied')
    }
  },

  setPasswordRequest: async (req) => {
    console.log("+ Set password request")
    const auth = await authenticate(req.body.domain, req.body.username, req.body.password)
    if (auth !== null) {
      try {
        const hash = await bcrypt.hash(req.body.newpassword, local_settings.authentication.rounds)
        const result = await auth.database.setUserPassword(auth.authUser.id, hash)
        return result
      } catch (err) {
        return Message.error('Could not set password', err.message)
      }
    } else {
      return Message.error('Access denied')
    }
  }
}
