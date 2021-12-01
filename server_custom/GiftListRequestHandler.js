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

  async getUserByUsername (username, isClean = false) {
    const cleaned = !isClean ? this.cleanUsername(username) : username
    const foundUser = await this.db.find('users', { username: cleaned })
    return (foundUser.result.length === 1) ? foundUser.result[0] : null
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
      case 'get_user':
        result = await this.requestGetUser(requestBody, token)
        break
      case 'update_user':
        result = await this.requestUpdateUser(requestBody, token)
        break
      case 'update_password':
        result = await this.requestUpdatePassword(requestBody, token)
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
      case 'get_friended_users':
        result = await this.requestGetFriendedUsers(requestBody, token)
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
      const user = await this.getUserByUsername(cleanedUsername, true)
      if (!user) {
        const userResp = await this.db.add('users', {
          username: cleanedUsername,
          email: requestBody.email,
          name: requestBody.name
        })
        const newUser = await this.getUserByUsername(cleanedUsername, true)
        if (newUser) {
          const userId = newUser._id.toString()
          const hash = await this.auth.generateHash(requestBody.password)
          const pwrdResp = await this.db.addForUser('passwords', userId, {
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
    await this.db.deleteAllForUser('buyers', token.id)
    await this.db.deleteAllForUser('friends', token.id)
    await this.db.deleteAllForUser('gifts', token.id)
    await this.db.deleteAllForUser('passwords', token.id)
    const resp = await this.db.delete('users', token.id)
    return resp
  }

  async requestGetUser (requestBody, token) {
    const user = await this.db.get('users', token.id)
    return user
  }

  async requestUpdateUser (requestBody, token) {
    const cleanedUsername = this.cleanUsername(requestBody.username)
    const user = await this.getUserByUsername(cleanedUsername, true)
    if (!user || (user._id.toString() === token.id)) {
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

  async requestUpdatePassword (requestBody, token) {
    log("+ Set password request")
    const users = await this.db.get('users', token.id)
    if (users.result.length === 1) {
      const userId = users.result[0]._id.toString()
      const userPassword = await this.db.findForUser('passwords', userId)
      if (await this.auth.verifyPassword(requestBody.password, userPassword.result[0].password)) {
        try {
          const userPasswordId = userPassword.result[0]._id.toString()
          const hash = await this.auth.generateHash(requestBody.newpassword)
          const result = await this.db.update('passwords', userPasswordId, { password: hash })
          return result
        } catch (err) {
          return Message.error('Could not set password', err.message)
        }
      } else {
        return Message.error('Access denied')
      }
    } else {
      return Message.error('Could not find user.')
    }
  }

  async getAuthenticatedUser (username, password) {
    const user = await this.getUserByUsername(username)
    if (user) {
      const userPassword = await this.db.findForUser('passwords', user._id.toString())
      if (userPassword.result.length === 1) {
        if (await this.auth.verifyPassword(password, userPassword.result[0].password)) {
          return user
        } else {
          log(`!> Passwords did not validate.`)
        }
      } else {
        log(`!> Password not found.`)
      }
    } else {
      log(`!> No user or multiple users found`)
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
    const giftResp = await this.db.deleteForUser('gifts', requestBody.giftId, token.id)
    const buyerResp = await this.db.deleteAllByQuery('buyers', { gift: requestBody.giftId })
    return giftResp
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
    const friend = await this.getUserByUsername(requestBody.friend.username)
    if (friend) {
      const friendId = friend._id.toString()
      if (friendId !== token.id) {
        // Are we already friends?
        const foundFriend = await this.db.findForUser('friends', token.id, { friend: friendId })
        if (foundFriend.result.length === 0) {
          const resp = await this.db.addForUser('friends', token.id, {
            friend: friendId
          })
          return resp
        } else {
          return Message.error(`Already friends with ${friend.name}.`)
        }
      } else {
        return Message.error('Unable to add yourself as a friend.')
      }
    } else {
      return Message.error('Friend not found.')
    }
  }

  async requestDeleteFriend (requestBody, token) {
    // Delete Friend from ID where user is token.id.
    const friend = await this.db.findForUser('friends', token.id, { friend: requestBody.friendId })
    if (friend.result.length === 1) {
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

  async requestGetFriendedUsers (requestBody, token) {
    // Get users where I am their friend.
    const friendedUsers = await this.db.find('friends', { friend: token.id })
    const friendedIds = friendedUsers.result.map(friend => { return friend.user })
    const users = await this.db.getAll('users', friendedIds)
    const returnUsers = users.result.map(user => ({ _id: user._id, name: user.name, username: user.username }))
    return Message.success(`Got friended users`, returnUsers)
  }

  async requestGetFriendsGiftList (requestBody, token) {
    const results = []
    // First we get all this user's friends.
    const allUserFriends = await this.getFriends(token.id)

    const friendRequests = allUserFriends.result.map(friend => {
      return new Promise(async (resolve, reject) => {
        // get the friend's gift list
        const friendGifts = await this.db.findForUser('gifts', friend._id.toString())
        // get the gift's buyers
        const buyers = await this.db.find('buyers', {gift: { $in: friendGifts.result.map(g => g._id.toString()) }})
        // get the name of each buyer
        const buyerUsers = await this.db.getAll('users', buyers.result.map(b => b.user))
        resolve({ friend, friendGifts, buyers, buyerUsers })
      })
    })

    const resultArray = await Promise.all(friendRequests)

    resultArray.forEach(({ friend, friendGifts, buyers, buyerUsers }) => {
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
    })

    return Message.success(`Got friends gift list`, results)
  }
}
