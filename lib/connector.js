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

  /**
   * Set the token to use when making requests.
   * @param {String} token authentication token
   */
  setToken (token) {
    this.token = token
  }

  /**
   * Return data, or error if an error was found.
   * @param {Object} response api response
   */
  returnSuccess (response) {
    return (response.data.error) ? this.returnError(response.data) : response.data
  }

  /**
   * Return an error object. Provides default message if none available.
   * @param {Object} response api response
   */
  returnError (response) {
    return {
      error: true,
      message: response.message || 'Server encountered an error'
    }
  }

  /**
   * Register an account.
   * @param {String} username
   * @param {String} password
   * @param {String} name
   * @param {String} email
   * @param {String} code
   */
  async register (username, password, name, email, code) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        request: 'register',
        username: username,
        password: password,
        name: name,
        email: email,
        code: code
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Unregister an account.
   */
  async unregister () {
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
   * @param {String} username
   * @param {String} password
   */
  async login (username, password) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        request: 'login',
        username: username,
        password: password
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Update user password.
   * @param {String} username
   * @param {String} password
   * @param {String} newpassword
   */
  async updatePassword (password, newpassword) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'update_password',
        password: password,
        newpassword: newpassword
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Forgot Password
   */
  async forgotPassword (username) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        request: 'forgot_password',
        username: username
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Reset Password
   */
  async resetPassword (resetCode, newpassword) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        request: 'reset_password',
        code: resetCode,
        password: newpassword
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Get your user details.
   */
  async getUser () {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_user'
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Update your user account.
   * @param {String} username
   * @param {String} name
   * @param {String} email
   */
  async updateUser (username, name, email) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'update_user',
        username: username,
        name: name,
        email: email
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Clear session.
   */
  logout () {
    this.token = ''
  }

  /**
   * Add a gift to current user.
   * @param {Object} gift
   */
  async addGift (gift) {
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
   * Update a gift.
   * @param {String} giftId
   * @param {Object} gift
   */
  async updateGift (giftId, gift) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'update_gift',
        giftId: giftId,
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
  async deleteGift (giftId) {
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
  async getGifts () {
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
  async addBuyer (giftId) {
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
  async deleteBuyer (giftId) {
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
   * Add a friend from username.
   * @param {String} username
   */
  async addFriend (username) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'add_friend',
        friend: {
          username: username
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
  async deleteFriend (friendId) {
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
  async getFriends () {
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
   * Get all friends.
   */
  async getFriendedUsers () {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_friended_users'
      })
      return this.returnSuccess(resp)
    } catch (e) {
      return this.returnError(e)
    }
  }

  /**
   * Return all current user's friends, with their gifts and buyers.
   */
  async getFriendsGiftList () {
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
