const moment = require('moment-timezone')
const Database = require('./database')
const Message = require('./msg')

module.exports = class RequestHandler {

  /**
   * Create a new request handler.
   * @param {Database} database 
   * @param {Object} config 
   */
  constructor (database, config) {
    this.db = database
    this.config = config
    this.queue = []
    this.digesting = false
  }

  /**
   * Add a new request to the queue and process.
   * @param {Object} req 
   * @param {Object} res 
   */
  queueRequest (req, res) {
    console.log("✉ Adding request to queue")
    this.queue.push({req: req, res: res})
    if (!this.digesting) {
      console.log("⚙ Trigger Digest")
      this.digestRequestQueue()
    }
  }

  /**
   * Will process the queue. Does not need to be invoked manually.
   */
  async digestRequestQueue() {
    this.digesting = (queue.length > 0)
  
    if (this.digesting) {
      const { req, res } = queue.shift()
      
      // Verify token
      const token = req.body.token
      const validToken = true // TODO
  
      if (validToken) {
        results = await this.processDBRequest(req.body, token)
        console.log("✓ Completed Request")
      } else {
        results = Message.error('Access denied', '⚠ Denied Request')
      }
      res.json(results)
      this.digestRequestQueue()
    }
  }

  /**
   * Validate user session from token. Will trigger database action on success.
   * @param {Object} requestBody
   * @param {Object} token
   */
  async processDBRequest (requestBody, token) {
    const userId = token.id
    const tokenIssuedAt = token.time
    const users = await database.get('user', userId)
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
      const actionResult = await performDatabaseAction(requestBody, userId, user.permissions.role)
      return actionResult
    }
  }
}
