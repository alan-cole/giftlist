const axios = require('axios')

class API {

  constructor(url) {
    this.url = url
    this.user = null
    this.token = ''
  }

  /**
   * Create Account: https://strapi.io/documentation/3.x.x/guides/authentication.html#registration
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
      console.log(resp.data.message)
      return true
    } catch (e) {
      console.error(e.response.data.message)
      return false
    }
  }

  /**
   * Authenticate: https://strapi.io/documentation/3.x.x/guides/authentication.html#registration
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

  logout() {
    console.log('Logged out.')
    this.token = ''
  }

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
}

async function logout() {
  api.logout()
}

async function addUsers() {
  await api.register('steve@gmail.com', 'XXsteve', 'steve')
  await api.register('mark@gmail.com', 'XXmark', 'mark')
  await api.register('john@gmail.com', 'XXjohn', 'john')
  await api.register('luke@gmail.com', 'XXluke', 'luke')
  await api.register('james@gmail.com', 'XXjames', 'james')
}

const api = new API('http://localhost:3000')

async function setup () {
  await addUsers()

  await api.login('steve@gmail.com', 'XXsteve')
  await api.addGift({ name: 'Final fantasy', link: 'http://duckduckgo.com', price: '49.95' })
  await api.addGift({ name: 'Resident evil', link: 'http://duckduckgo.com', price: '89.95' })
  await api.addGift({ name: 'Game of Thrones', link: 'http://duckduckgo.com', price: '25' })
  await api.addFriend('john@gmail.com')
  await api.addFriend('luke@gmail.com')
  await api.addFriend('james@gmail.com')
  await logout()

  await api.login('john@gmail.com', 'XXjohn')
  await api.addGift({ name: 'Pokemon', link: 'http://duckduckgo.com', price: '49.95' })
  await api.addGift({ name: 'The Matrix', link: 'http://duckduckgo.com', price: '25' })
  await api.addGift({ name: 'The Simpsons', link: 'http://duckduckgo.com', price: '25' })
  await api.addFriend('steve@gmail.com')
  await api.addFriend('mark@gmail.com')
  await logout()
}

async function getStuff () {
  await api.login('steve@gmail.com', 'XXsteve')
  console.log(await api.getGifts())
  console.log(await api.getFriends())
  await logout()
}

// Deleteing
// console.log(await api.deleteGift(getGiftResp[0]._id))
// console.log(await api.deleteFriend(getFriendResp[0]._id))

// setup()
getStuff()
