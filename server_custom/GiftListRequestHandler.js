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
   * Helper class to get friends of a user.
   * @param {String} userId ID of current user
   */
  async getFriends (userId) {
    const connectedFriends = await this.db.find('friends', { user: userId })
    const friendIds = connectedFriends.result.map(friend => { return friend.friend })
    const friends = await this.db.getAll('users', friendIds)
    return friends
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
      case 'delete_gift':
        result = await this.requestDeleteGift(requestBody, token)
        break
      case 'get_gifts':
        result = await this.requestGetGifts(requestBody, token)
        break
      case 'add_friend':
        result = await this.requestAddFriend(requestBody, token)
        break
      case 'delete_friend':
        result = await this.requestDeleteFriend(requestBody, token)
        break
      case 'add_buyer':
        result = await this.requestAddBuyer(requestBody, token)
        break
      case 'delete_buyer':
        result = await this.requestDeleteBuyer(requestBody, token)
        break
      case 'get_friends':
        result = await this.requestGetFriends(requestBody, token)
        break
      case 'get_friends_gift_list':
        result = await this.requestGetFriendsGiftList(requestBody, token)
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

  async requestDeleteGift (requestBody, token) {
    const resp = await this.db.delete('gifts', requestBody.giftId)
    return resp
  }

  async requestGetGifts (requestBody, token) {
    const resp = await this.db.find('gifts', { user: token.id })
    return resp
  }

  async requestAddBuyer (requestBody, token) {
    const resp = await this.db.add('buyers', {
      gift: requestBody.giftId,
      user: token.id
    })
    return resp
  }

  async requestDeleteBuyer (requestBody, token) {
    const registers = await this.db.find('buyers', { user: token.id, gift: requestBody.giftId })
    if (registers.result.length > 0) {
      const resp = await this.db.delete('buyers', registers.result[0]._id)
      return resp
    } else {
      return Message.error('Registry entry not found.')
    }
  }

  async requestAddFriend (requestBody, token) {
    // Add friend from email address. Only accept if email is found in users.
    const friend = await this.db.find('users', { email: requestBody.friend.email })
    if (friend.result.length == 1) {
      const resp = await this.db.add('friends', {
        friend: friend.result[0]._id.toString(),
        user: token.id
      })
      return resp
    } else {
      return Message.error('Friend email not found.')
    }
  }

  async requestDeleteFriend (requestBody, token) {
    // Delete Friend from ID where user is token.id.
    const friend = await this.db.find('friends', { user: token.id, friend: requestBody.friendId })
    if (friend.result.length == 1) {
      const resp = await this.db.delete('friends', friend.result[0]._id)
      return resp
    } else {
      return Message.error('Friend email not found.')
    }
  }

  async requestGetFriends (requestBody, token) {
    // Get friends based on token.id
    const friends = await this.getFriends(token.id)
    const results = friends.result.map(user => ({ _id: user._id, name: user.name }))
    return Message.success(`Got friends`, results)
  }

  async requestGetFriendsGiftList (requestBody, token) {
    // Get Friends
    const friends = await this.getFriends(token.id)
    const results = []
    for (let i = 0; i < friends.result.length; i++) {
      const friend = friends.result[i]
      // Get Gifts of friends
      const friendGifts = await this.db.find('gifts', { user: friend._id.toString() })
      results.push({
        _id: friend._id,
        name: friend.name,
        gifts: friendGifts.result.map(gift => ({
          _id: gift._id,
          name: gift.name,
          price: gift.price
        }))
      })
      // TODO - Get buyers for gifts.
    }
    return Message.success(`Got friends gift list`, results)
  }

}