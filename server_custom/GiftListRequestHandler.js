const GiftListDatabase = require('./GiftListDatabase')
const RequestHandler = require('../server/lib/RequestHandler')
const Authentication = require('../server/lib/Authentication')
const Message = require('../server/lib/msg')
const log = require('../server/lib/log')

module.exports = class GiftListRequestHandler extends RequestHandler {

  /**
   * Create a new request handler.
   * @param {GiftListDatabase} database
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
    const connectedFriends = await this.db.findForUser('friends', userId)
    const friendIds = connectedFriends.result.map(friend => { return friend.friend })
    const friends = await this.db.getAll('users', friendIds)
    return friends
  }

  /**
   * Clean a username for registration / login
   * @param {String} username
   */
  cleanUsername (username) {
    return username.trim().toLowerCase()
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
      case 'unregister':
        result = await this.requestUnregister(requestBody, token)
        break
      case 'login':
        result = await this.requestLogin(requestBody)
        break
      case 'update_user':
        result = await this.requestUpdateUser(requestBody, token)
        break
      case 'changepassword':
        result = await this.requestChangePassword(requestBody)
        break
      case 'add_gift':
        result = await this.requestAddGift(requestBody, token)
        break
      case 'update_gift':
        result = await this.requestUpdateGift(requestBody, token)
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
    if (requestBody.code === this.config.register.code) {
      const cleanedUsername = this.cleanUsername(requestBody.username)
      const users = await this.db.find('users', { username: cleanedUsername })
      if (users.result.length === 0) {
        const userResp = await this.db.add('users', {
          username: cleanedUsername,
          email: requestBody.email,
          name: requestBody.name
        })
        const newUser = await this.db.find('users', { username: cleanedUsername })
        if (newUser.result.length === 1) {
          const hash = await this.auth.generateHash(requestBody.password)
          const pwrdResp = await this.db.add('passwords', {
            user: newUser.result[0]._id,
            password: hash
          })
          return userResp
        } else {
          return Message.error('Something went wrong creating user')
        }
      } else {
        return Message.error("Username already in use")
      }
    } else {
      return Message.error("Incorrect code")
    }
  }

  async requestUnregister (requestBody, token) {
    const user = await this.db.get('users', token.id)
    const resp = await this.db.delete('users', token.id)
    const userPassword = await this.db.findForUser('passwords', user.result[0]._id)
    // const userPassword = await this.db.find('passwords', { user: user.result[0]._id })
    if (userPassword.result.length === 1) {
      const passwordResp = await this.db.delete('passwords', userPassword.result[0]._id)
    } else {
      return Message.error('Password not found')
    }
    return resp
  }

  async requestUpdateUser (requestBody, token) {
    const cleanedUsername = this.cleanUsername(requestBody.username)
    // Check username is available (isn't in use, or is currently my username)
    const users = await this.db.find('users', { username: cleanedUsername })
    if (users.result.length === 0 || (users.result.length === 1 && users.result[0]._id.toString() === token.id)) {
      const resp = await this.db.update('users', token.id, {
        username: cleanedUsername,
        email: requestBody.email,
        name: requestBody.name
      })
      return resp
    } else {
      return Message.error("Username already in use")
    }
  }

  async requestLogin (requestBody) {
    const authUser = await this.getAuthenticatedUser(requestBody.username, requestBody.password)
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
    const authUser = await this.getAuthenticatedUser(requestBody.username, requestBody.password)
    if (authUser) {
      const userPassword = await this.db.findForUser('passwords', authUser.authUser.id)
      if (userPassword.result.length === 1) {
        try {
          const hash = await this.auth.generateHash(requestBody.newpassword)
          const result = await this.db.update('passwords', userPassword.result[0]._id, { password: hash })
          return result
        } catch (err) {
          return Message.error('Could not set password', err.message)
        }
      } else {
        return Message.error('Could not find password')
      }
    } else {
      return Message.error('Access denied')
    }
  }

  async getAuthenticatedUser (username, password) {
    const cleanedUsername = this.cleanUsername(username)
    const users = await this.db.find('users', { username: cleanedUsername })
    if (users.result.length === 1) {
      const userPassword = await this.db.findForUser('passwords', users.result[0]._id)
      if (userPassword.result.length === 1) {
        if (await this.auth.verifyPassword(password, userPassword.result[0].password)) {
          return users.result[0]
        } else {
          log(`!> Passwords did not validate.`)
        }
      } else {
        log(`!> Password not found.`)
      }
    } else {
      log(`!> No user or multiple users found: Users ${users.result.length}`)
    }
    return false
  }

  async requestAddGift (requestBody, token) {
    const resp = await this.db.addForUser('gifts', token.id, {
      name: requestBody.gift.name,
      link: requestBody.gift.link,
      price: requestBody.gift.price
    })
    return resp
  }

  async requestUpdateGift (requestBody, token) {
    const resp = await this.db.updateForUser('gifts', requestBody.giftId, token.id, {
      name: requestBody.gift.name,
      link: requestBody.gift.link,
      price: requestBody.gift.price
    })
    return resp
  }

  async requestDeleteGift (requestBody, token) {
    const resp = await this.db.deleteForUser('gifts', requestBody.giftId, token.id)
    return resp
  }

  async requestGetGifts (requestBody, token) {
    const resp = await this.db.findForUser('gifts', token.id)
    return resp
  }

  async requestAddBuyer (requestBody, token) {
    const resp = await this.db.addForUser('buyers', token.id, {
      gift: requestBody.giftId
    })
    return resp
  }

  async requestDeleteBuyer (requestBody, token) {
    const registers = await this.db.findForUser('buyers', token.id, { gift: requestBody.giftId })
    if (registers.result.length > 0) {
      const resp = await this.db.delete('buyers', registers.result[0]._id)
      return resp
    } else {
      return Message.error('Registry entry not found.')
    }
  }

  async requestAddFriend (requestBody, token) {
    // Add friend from username. Only accept if username is found in users.
    const cleanedFriendUsername = this.cleanUsername(requestBody.friend.username)
    const friend = await this.db.find('users', { username: cleanedFriendUsername })
    if (friend.result.length == 1) {
      const resp = await this.db.addForUser('friends', token.id, {
        friend: friend.result[0]._id.toString()
      })
      return resp
    } else {
      return Message.error('Friend username not found.')
    }
  }

  async requestDeleteFriend (requestBody, token) {
    // Delete Friend from ID where user is token.id.
    const friend = await this.db.findForUser('friends', token.id, { friend: requestBody.friendId })
    if (friend.result.length == 1) {
      const resp = await this.db.delete('friends', friend.result[0]._id)
      return resp
    } else {
      return Message.error('Friend username not found.')
    }
  }

  async requestGetFriends (requestBody, token) {
    // Get friends based on token.id
    const friends = await this.getFriends(token.id)
    const results = friends.result.map(user => ({ _id: user._id, name: user.name }))
    return Message.success(`Got friends`, results)
  }

  async requestGetFriendsGiftList (requestBody, token) {
    // First we get all this user's friends.
    const allUserFriends = await this.getFriends(token.id)
    const results = []

    // For each friend...
    for (let i = 0; i < allUserFriends.result.length; i++) {
      const friend = allUserFriends.result[i]

      // get the friend's gift list
      const friendGifts = await this.db.findForUser('gifts', friend._id.toString())
      // get the gift's buyers
      const buyers = await this.db.find('buyers', {gift: { $in: friendGifts.result.map(g => g._id.toString()) }})
      // get the name of each buyer
      const buyerUsers = await this.db.getAll('users', buyers.result.map(b => b.user))

      // Map buyer ids to name
      const buyerIdtoNameMap = {}
      buyerUsers.result.forEach(b => {
        if (buyerIdtoNameMap[b._id] === undefined) {
          buyerIdtoNameMap[b._id] = {
            name: b.name,
            self: (b._id.toString() === token.id)
          }
        }
      })

      // Map gift id to buyers
      const giftToBuyerMap = {}
      buyers.result.forEach(b => {
        if (giftToBuyerMap[b.gift] === undefined) {
          giftToBuyerMap[b.gift] = []
        }
        giftToBuyerMap[b.gift].push(buyerIdtoNameMap[b.user])
      })

      // Get the friend's details plus each gift and the gift's buyers
      results.push({
        _id: friend._id,
        name: friend.name,
        gifts: friendGifts.result.map(gift => ({
          _id: gift._id,
          name: gift.name,
          link: gift.link,
          price: gift.price,
          buyers: giftToBuyerMap[gift._id]
        }))
      })
    }

    return Message.success(`Got friends gift list`, results)
  }
}
