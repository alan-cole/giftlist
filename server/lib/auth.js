const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Message = require('./msg')
const Database = require('./database')
const log = require('./log')

// ===========================================================
// API
// ===========================================================
module.exports = class Authentication {

  constructor (database, config) {
    this.db = database
    this.config = config
  }

  async login (req) {
    const auth = await this.authenticate(req.body.username, req.body.password)
    if (auth !== null) {
      // Store key values in token.
      var token = this.generateToken({
        id: auth.id,
        name: auth.name,
        time: new Date().getTime()
      })
      return Message.success('Access granted', {
        'token': token,
        'id': auth.id,
        'name': auth.name
      })
    } else {
      return Message.error('Access denied')
    }
  }

  async changePassword (req) {
    log("+ Set password request")
    const auth = await this.authenticate(req.body.username, req.body.password)
    if (auth !== null) {
      try {
        const hash = await bcrypt.hash(req.body.newpassword, config.authentication.rounds)
        const result = await auth.database.update('user', auth.authUser.id, { password: hash })
        return result
      } catch (err) {
        return Message.error('Could not set password', err.message)
      }
    } else {
      return Message.error('Access denied')
    }
  }

  async authenticate (username, password) {
    log("Authenticating: " + username)
    // Get user
    const users = await this.db.find('users', { email: username })
    if (users.result.length === 1) {
      var hash = users.result[0].password
      // Load hash from your password DB.
      const result = await bcrypt.compare(password, hash)
      if (result === true) {
        // Valid user. Pass.
        log("Successful authentication")
        return users.result[0]
      } else {
        log("!> Passwords did not validate.")
      }
    } else {
      log("!> No user or multiple users found: Users " + users.result.length)
    }
    return null
  }

  generateToken (payload) {
    return jwt.sign(payload, config.authentication.secret)
  }
}
