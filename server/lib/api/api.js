const jwt         = require('jsonwebtoken')
const moment      = require('moment-timezone')
const beautify    = require('js-beautify').js_beautify
const bcrypt      = require('bcrypt')
const DBConnector = require('../db/db')
const Message     = require('../msg/msg')

let app_db            = null;
let local_settings    = null;
let download_registry = {};
let db_connections    = {};
let digesting         = false;
let queue             = [];

const Roles = {
  ADMIN: "admin",
  STANDARD: "standard",
  VIEW_ALL: "view_all",
  DISABLED: "disabled"
}

const permissions = {
  add_client: 'SA',     // Standard and Admin
  delete_client: 'A',   // Admin
  add_profile: 'SA',    // Standard and Admin
  delete_profile: 'A',  // Admin
  add_user: 'A',        // Admin
  delete_user: 'A',     // Admin
  add_event: 'SA',      // Standard and Admin
  delete_event: 'SA',   // Standard and Admin
  import: 'A',          // Admin
  export: 'A',          // Admin
  sync: 'SAV'           // Limited Standard (only user data) and Admin.
}

async function getDomainLogin(domain) {
  const item = await app_db.collection('users').find({domain: domain}).toArray()
  return (item.length > 0) ? {
    domain: item[0].domain,
    db_username: item[0].db_username,
    db_password: item[0].db_password,
    db_host: item[0].db_host
  } : null
}

async function getDomainDB(domain) {
  if (db_connections[domain.domain] === undefined) {
    console.log(`Stored DB connection for: ${domain.domain}`)
    db_connections[domain.domain] = new DBConnector()
    db_connections[domain.domain].setTimestamp(true)
    const res = await db_connections[domain.domain].initAsync(domain.db_username, domain.db_password, domain.db_host)
    if (res.error) {
      console.log(`! DB init error for domain: ${domain.domain}`)
      return null
    }
  }
  return db_connections[domain.domain]
}

async function getDatabase(token) {
  try {
    const authResult = await jwt.verify(token, local_settings.authentication.secret)
    const domain = await getDomainLogin(authResult.domain)
    const database = await getDomainDB(domain)
    return {
      database: database,
      authToken: authResult
    }
  } catch (err) {
    return null
  }
}

// ===========================================================
// REQUEST MANAGEMENT
// ===========================================================
function validatePermission(user_role, required_role) {
  if (required_role === 'A' && user_role === Roles.ADMIN) {
    return true
  }
  else if (required_role === 'SA' && (user_role === Roles.STANDARD || user_role === Roles.ADMIN)) {
    return true
  }
  else if (required_role === 'SAV' && (user_role === Roles.STANDARD || user_role === Roles.ADMIN || user_role === Roles.VIEW_ALL)) {
    return true
  }
  else {
    return false
  }
}

/**
 * Validate user session from token. Will trigger database action on success.
 * @param {DBConnector} database
 * @param {Object} requestBody
 * @param {String} authToken
 */
async function processDBRequestAsync(database, requestBody, authToken) {
  const userId = authToken.id
  const tokenIssuedAt = authToken.time
  const users = await database.getAsync('user', userId)
  const user = (users.result.length <= 0) ? null : users.result[0]

  if (user === null) {
    return Message.error("User doesn't exist")
  }
  else if (user.permissions.role === Roles.DISABLED) {
    return Message.error("Account disabled")
  }
  else if (tokenIssuedAt < user.password_last_updated) {
    return Message.error("Your session ended")
  }
  else {
    console.log(`User [${userId}] role: ${user.permissions.role}`)
    const actionResult = await performDatabaseAction(database, requestBody, userId, user.permissions.role)
    return actionResult
  }
}

/**
 * Compare modified dates for items to check for potential changes.
 * @param {DBConnector} database database
 * @param {String} collection collection name
 * @param {Object} item item to add
 */
async function checkModifiedDate(database, collection, newItem) {
  const items = await database.getAsync(collection, newItem.id)
  if (items.result.length === 1) {
    const existingItem = items.result[0]
    const hasConflict = moment(existingItem.modified).isAfter(newItem.modified)
    if (hasConflict) {
      return Message.conflict(`The remote ${collection} is newer`, existingItem, collection, `Conflict: The remote ${collection} is newer`)
    } else {
      return Message.success(`Conflict check: ${collection} has no conflict`)
    }
  }
  return Message.success(`Conflict check: ${collection} not found`)
}

/**
 * Check item before adding to database.
 * @param {DBConnector} database database
 * @param {String} collection collection name
 * @param {Object} item item to add
 */
async function addItemToDatabase(database, collection, item) {
  let result = null
  const hasConflict = await checkModifiedDate(database, collection, item)
  if (!hasConflict.error) {
    if (collection === 'user') {
      if (item.changepassword) {
        // Encrypt password for user if available.
        const hash = await bcrypt.hash(item.changepassword, local_settings.authentication.rounds)
        item.changepassword = hash
      }
    }
    result = await database.addAsync(collection, item)
  } else {
    result = hasConflict
  }
  return result
}

/**
 * Perform an action on the database.
 * @param {DBConnector} database
 * @param {Object} requestBody request body
 * @param {String} userId
 * @param {String} userRole
 */
async function performDatabaseAction(database, requestBody, userId, userRole) {
  const action = requestBody.request
  const permissableAction = validatePermission(userRole, permissions[action])

  if (permissableAction) {
    let result = null
    try {
      switch (action) {
        case 'add_client':
          result = await addItemToDatabase(database, 'client', JSON.parse(requestBody.client))
          break
        case 'add_event':
          result = await addItemToDatabase(database, 'event', JSON.parse(requestBody.event))
          break
        case 'add_profile':
          result = await addItemToDatabase(database, 'profile', JSON.parse(requestBody.profile))
          break
        case 'add_user':
          result = await addItemToDatabase(database, 'user', JSON.parse(requestBody.user))
          break
        case 'delete_client':
          result = await database.deleteAsync('client', requestBody.client_id)
          break
        case 'delete_profile':
          result = await database.deleteAsync('profile', requestBody.profile_id)
          break
        case 'delete_user':
          result = await database.deleteAsync('user', requestBody.user_id)
          break
        case 'delete_event':
          const filter = (userRole === Roles.STANDARD) ? userId : null
          result = await database.deleteAsync('event', requestBody.event_id, { uidFilter: filter })
          break
        case 'import':
          const zip = new require('node-zip')(requestBody.data, {base64: true, checkCRC32: true})
          const data = zip.files['export.json'].asText()
          result = await database.importAsync(JSON.parse(data), requestBody.options)
          break
        case 'export':
          const uuid = require('uuid').v4()
          download_registry[uuid] = { token: requestBody.token }
          result = Message.success('Prepared an export URL', { path: `/download/${uuid}` })
          break
        case 'sync':
          const syncOptions = JSON.parse(requestBody.options)
          if (userRole === Roles.STANDARD) {
            syncOptions['event_uid_filter'] = userId
          }
          result = await database.syncAsync(syncOptions)
          break
        default:
          result = Message.error("Unrecognized request")
          break
      }
      return result
    } catch (err) {
      return Message.error("Internal server error processing the request", err.message)
    }
  } else {
    return Message.error("Access denied")
  }
}

// ===========================================================
// DOWNLOAD
// ===========================================================
/**
 * Convert path UUID into an exported zip. Calls response with zip file.
 * @param {Object} request - server request
 * @param {Object} response - server response
 */
async function processDownload(request, response) {
  try {
    // Delete one-time download in registry.
    const uuid = request.params[0]
    const registry_entry = download_registry[uuid]
    delete download_registry[uuid]
    // Export and zip database.
    const { database } = await getDatabase(registry_entry.token)
    const data = await database.exportAsync(false)
    const zipData = getZipFromExport(data.result)
    response.writeHead(200, zipData.head)
    response.end(zipData.body)
  } catch (e) {
    response.send('Access denied')
  }
}

/**
 * Convert json object into a binary zip. Returns head and body data for response.
 * @param {Object} data - json object
 */
function getZipFromExport(data) {
  const filename = `${moment(data.exported).format('YYYYMMDDHHmmss')}_DB_EXPORT.zip`
  const zip = new require('node-zip')()
  zip.file('export.json', beautify(JSON.stringify(data)))
  const compressed_data = zip.generate({
    base64: false,
    compression: 'DEFLATE'
  })
  return {
    head: {
      'Content-Type': 'application/zip',
      'Content-disposition': 'attachment;filename=' + filename,
      'Content-Length': compressed_data.length
    },
    body: new Buffer(compressed_data, 'binary')
  }
}

// ===========================================================
// REQUEST PROCESSING
// ===========================================================
async function digestRequestQueue() {
  digesting = (queue.length > 0)

  if (digesting) {
    const { req, res } = queue.shift()
    const dbReturn = await getDatabase(req.body.token)
    let results = null

    if (dbReturn !== null) {
      const { database, authToken } = dbReturn
      results = await processDBRequestAsync(database, req.body, authToken)
      console.log("✓ Completed Request")
    } else {
      results = Message.error('Access denied', '⚠ Denied Request')
    }
    res.json(results)
    digestRequestQueue()
  }
}

// ===========================================================
// API
// ===========================================================
module.exports = {
  init (_app_db, _local_settings) {
    app_db = _app_db
    local_settings = _local_settings
  },
  handleDownload: processDownload,
  handleRequest (req, res) {
    console.log("✉ Adding request to queue")
    queue.push({req: req, res: res})
    if (!digesting) {
      console.log("⚙ Trigger Digest")
      digestRequestQueue()
    }
  },
}
