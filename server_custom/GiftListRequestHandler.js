const Database = require('../server/lib/Database')
const RequestHandler = require('../server/lib/RequestHandler')
const Authentication = require('../server/lib/Authentication')
const Message = require('../server/lib/msg')
const log = require('../server/lib/log')

module.exports = class GiftListRequestHandler extends RequestHandler {

  /**
   * Create a new request handler.
   * @param {Database} database
   * @param {Object} config 
   */
  constructor (database, config) {
    super()
    this.db = database
    this.config = config
    this.auth = new Authentication(config)
  }

  /**
   * Process request.
   * @param {Object} requestBody
   */
  async processRequest (requestBody) {
    console.log(requestBody)
    let result = null
    switch (requestBody.request) {
      case 'login':
        result = await this.requestLogin(requestBody)
        break
      case 'changepassword':
        result = await this.requestChangePassword(requestBody)
        break
    }
    return result
  }

  async requestLogin (requestBody) {
    const authUser = await this.getAuthenticatedUser(requestBody.username, requestBody.password)
    if (authUser) {
      var token = this.authUser.generateToken({
        id: authUser.id,
        name: authUser.name,
        time: new Date().getTime()
      })
      return Message.success('Access granted', {
        'token': token,
        'id': authUser.id,
        'name': authUser.name
      })
    } else {
      return Message.error('Access denied')
    }
  }

  async requestChangePassword (requestBody) {
    log("+ Set password request")
    const authUser = await this.getAuthenticatedUser(requestBody.username, requestBody.password)
    if (authUser) {
      try {
        const hash = await this.authUser.generateHash(requestBody.newpassword)
        const result = await this.db.update('user', authUser.authUser.id, { password: hash })
        return result
      } catch (err) {
        return Message.error('Could not set password', err.message)
      }
    } else {
      return Message.error('Access denied')
    }
  }

  async getAuthenticatedUser (username, password) {
    const users = await this.db.find('users', { email: username })
    if (users.result.length === 1) {
      if (await this.auth.verifyPassword(password, users.result[0].password)) {
        return users.result[0]
      } else {
        log(`!> Passwords did not validate.`)
      }
    } else {
      log(`!> No user or multiple users found: Users ${users.result.length}`)
    }
    return false
  }

}