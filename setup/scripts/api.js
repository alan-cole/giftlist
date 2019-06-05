const axios = require('axios')

class API {

  constructor(url) {
    this.url = url
    this.token = ''
  }

  /**
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
      console.log(resp.data.message)
      return true
    } catch (e) {
      console.error(e.response.data.message)
      return false
    }
  }

  /**
   *
   */
  logout() {
    console.log('Logged out.')
    this.token = ''
  }

  /**
   * @param {Object} gift
   */
  async addGift(gift) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'add_gift',
        gift: gift
      })
      console.log(resp.data.message)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   * @param {String} giftId
   */
  async deleteGift(giftId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'delete_gift',
        giftId: giftId
      })
      console.log(resp.data.message)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   *
   */
  async getGifts() {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_gifts'
      })
      console.log(resp.data.message)
      return resp.data.result
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   * @param {String} giftId
   */
  async addBuyer(giftId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'add_buyer',
        giftId: giftId
      })
      console.log(resp.data.message)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   * @param {String} giftId
   */
  async deleteBuyer(giftId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'delete_buyer',
        giftId: giftId
      })
      console.log(resp.data.message)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
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
      console.log(resp.data.message)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   * @param {String} friendId
   */
  async deleteFriend(friendId) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'delete_friend',
        friendId: friendId
      })
      console.log(resp.data.message)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   * @param {String} email
   */
  async getFriends(email) {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_friends'
      })
      console.log(resp.data.message)
      return resp.data.result
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   *
   */
  async getFriendsGiftList() {
    try {
      const resp = await axios.post(`${this.url}/api`, {
        token: this.token,
        request: 'get_friends_gift_list'
      })
      console.log(resp.data.message)
      return resp.data.result
    } catch (e) {
      console.error(e.response.data.message)
    }
  }
}

module.exports = API
