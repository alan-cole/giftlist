const axios = require('axios')

class API {

  constructor(url) {
    this.url = url
    this.user = null
    this.token = ''
  }

  /**
   * Create Account: https://strapi.io/documentation/3.x.x/guides/authentication.html#registration
   * @param {String} username
   * @param {String} email
   * @param {String} password
   */
  async register(username, email, password) {
    try {
      const resp = await axios.post(`${this.url}/auth/local/register`, {
        username: username,
        email: email,
        password: password,
      })
      this.user = resp.data.user
      this.token = resp.data.jwt
      console.log('Registered.')
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  /**
   * Authenticate: https://strapi.io/documentation/3.x.x/guides/authentication.html#registration
   * @param {String} user 
   * @param {String} password 
   */
  async login(user, password) {
    try {
      const resp = await axios.post(`${this.url}/login`, {
        username: user,
        password: password
      })
      this.user = resp.data.user
      this.token = resp.data.jwt
      console.log('Logged in.')
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  async logout() {
    console.log('Logged out.')
    this.token = ''
  }

  async forgotPassword(email) {
    try {
      const resp = await axios.post(`${this.url}/auth/forgot-password`, {
        email: email,
        url: `${this.url}/admin/plugins/users-permissions/auth/reset-password`
      })
      console.log('Check your emails')
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  async resetPassword(code, password, passwordConfirmation) {
    try {
      const resp = await axios.post(`${this.url}/auth/reset-password`, {
        code: code,
        password: password,
        passwordConfirmation: passwordConfirmation
      })
      console.log('Reset password.')
    } catch (e) {
      console.error(e.response.data.message)
    }
  }

  // Return a list of users.
  async getGifts() {
    try {
      const resp = await axios.get(`${this.url}/gifts`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      console.log(resp.data)
    } catch (e) {
      console.error(e.response.data.message)
    }
  }
}

async function bootstrap() {
  const api = new API('http://localhost:3000')
  // const resp = await api.register('test', 'test@mailinator.com', 'testtest')
  const resp = await api.login('Luke', 'testtest')
  // const resp = await api.logout()
  // const resp = await api.forgotPassword('alan.d.m.cole@gmail.com')
  // const getGiftResp = await api.getGifts()
  console.log(resp)
}

bootstrap()