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
}

async function bootstrap() {
  const api = new API('http://localhost:3000')
  // const resp = await api.register('test@gmail.com', 'testtest', 'test')
  // console.log(resp)
  const loginResp = await api.login('test@gmail.com', 'testtest')
  console.log(loginResp)
  const addGiftResp = await api.addGift({
    name: 'Box',
    link: 'http://duckduckgo.com',
    price: '49.95'
  })
  console.log(addGiftResp)
  const getGiftResp = await api.getGifts()
  console.log(getGiftResp)
  const deleteGiftResp = await api.deleteGift(getGiftResp[0]._id)
  console.log(deleteGiftResp)
  api.logout()
}

bootstrap()