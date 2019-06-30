const axios = require('axios')

/**
 * Server connector to interact with GiftList api.
 */
class Connector {

  /**
   * Create an api connector.
   * @param {String} host api host e.g. https://api.com
   * @param {String} token authentication token
   */
  constructor (host, token = '') {
    this.url = host
    this.token = token
  }

  returnSuccess (response) {
    return (response.data.error) ? this.returnError(response.data) : response.data
  }

  returnError (response) {
    return {
      error: true,
      message: response.message || 'Server encountered an error'
    }
  }

  /**
   * Register an account.
   * @param {String} email
   * @param {String} password
   * @param {String} name
   */
  async register(email, password, name) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        request: 'register',
        email: email,
        password: password,
        name: name
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Unregister an account.
   * @param {String} email
   * @param {String} password
   * @param {String} name
   */
  async unregister() {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'unregister'
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Log into account. Will manage session.
   * @param {String} email
   * @param {String} password
   */
  async login(email, password) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        request: 'login',
        email: email,
        password: password
      })
      if (!resp.data.error) {
        this.token = resp.data.result.token
      }
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Clear session.
   */
  logout() {
    this.token = ''
  }

  /**
   * Add a gift to current user.
   * @param {Object} gift
   */
  async addGift(gift) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'add_gift',
        gift: gift
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Delete a gift from current user.
   * @param {String} giftId
   */
  async deleteGift(giftId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'delete_gift',
        giftId: giftId
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Get all gifts for current user.
   */
  async getGifts() {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_gifts'
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Add current user to a list of buyers for a gift.
   * @param {String} giftId
   */
  async addBuyer(giftId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'add_buyer',
        giftId: giftId
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Delete current user from a list of buyers for a gift.
   * @param {String} giftId
   */
  async deleteBuyer(giftId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'delete_buyer',
        giftId: giftId
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Add a friend from email.
   * @param {String} email
   */
  async addFriend(email) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'add_friend',
        friend: {
          email: email
        }
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Remove a friend.
   * @param {String} friendId
   */
  async deleteFriend(friendId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'delete_friend',
        friendId: friendId
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Get all friends.
   */
  async getFriends() {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_friends'
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Return all current user's friends, with their gifts and buyers.
   */
  async getFriendsGiftList() {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_friends_gift_list'
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }
}

module.exports = Connector
