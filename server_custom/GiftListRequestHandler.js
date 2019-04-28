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
    log(requestBody)
    const token = requestBody.token ? await this.auth.verifyToken(requestBody.token) : null
    let result = null
    switch (requestBody.request) {
      case 'register':
        result = await this.requestRegister(requestBody)
        break
      case 'login':
        result = await this.requestLogin(requestBody)
        break
      case 'changepassword':
        result = await this.requestChangePassword(requestBody)
        break
      case 'add_gift':
        result = await this.requestAddGift(requestBody, token)
        break
      case 'get_gifts':
        result = await this.requestGetGifts(requestBody, token)
        break
      default:
        result = Message.error("Unrecognized request")
        break
    }
    return result
  }

  async requestRegister (requestBody) {
    const users = await this.db.find('users', { email: requestBody.email })
    if (users.result.length === 0) {
      const hash = await this.auth.generateHash(requestBody.password)
      const resp = await this.db.add('users', {
        email: requestBody.email,
        password: hash,
        name: requestBody.name
      })
      return resp
    } else {
      return Message.error("Email alrady in use")
    }
  }

  async requestLogin (requestBody) {
    const authUser = await this.getAuthenticatedUser(requestBody.email, requestBody.password)
    if (authUser) {
      var token = this.auth.generateToken({
        id: authUser._id,
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
    const authUser = await this.getAuthenticatedUser(requestBody.email, requestBody.password)
    if (authUser) {
      try {
        const hash = await this.auth.generateHash(requestBody.newpassword)
        const result = await this.db.update('user', authUser.authUser.id, { password: hash })
        return result
      } catch (err) {
        return Message.error('Could not set password', err.message)
      }
    } else {
      return Message.error('Access denied')
    }
  }

  async getAuthenticatedUser (email, password) {
    const users = await this.db.find('users', { email: email })
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

  async requestAddGift (requestBody, token) {
    const resp = await this.db.add('gifts', {
      name: requestBody.gift.name,
      link: requestBody.gift.link,
      price: requestBody.gift.price,
      user: token.id
    })
    return resp
  }

  async requestGetGifts (requestBody, token) {
    const resp = await this.db.find('gifts', { user: token.id })
    return resp
  }

}