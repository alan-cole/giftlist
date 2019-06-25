const axios = require('axios')

class API {

  constructor(url) {
    this.url = url
    this.token = ''
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
      return false
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
      return false
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
      this.token = resp.data.result.token
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
      return false
    }
  }

  /**
   * Clear session.
   */
  logout() {
    console.log('Logged out.')
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
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
      return resp.data
    } catch (e) {
      console.error(e.response.data.message)
    }
  }
}

export default API
