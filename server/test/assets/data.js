const axios = require('axios')
const utils = require('../../../utilities/scripts/connector.js')
const account = utils.get_account('dev', '../utilities/')

module.exports = class KCHSTestData {

  constructor () {
    // Nothing
  }

  static async getLoginToken() {
    const login = await axios.post(`http://localhost:3000/login`, {
      domain: 'dev',
      username: account.user.username,
      password: account.user.password
    })
    return login.data.result.token
  }

  static async post (api, options) {
    return axios.post(`http://localhost:3000/${api}`, options)
  }

  static async get (api) {
    return axios.get(`http://localhost:3000${api}`)
  }

  static getAccount () {
    return account
  }

  static getClient() {
    return {
      "id": "94e83e80-cc55-4f9e-TEST-0ffa98bd4183",
      "modified": "2017-12-18T10:09:11.071Z",
      "name": "Test Client",
      "notes": "Test Client's notes",
      "phone": "1111222333",
      "email": "testclient@mailinator.com",
      "styles": [{
        "id": "a3931195-2357-4383-TEST-a63db9de4500",
        "description": "Test Description",
        "bowls": [{
          "colours": [{
            "colour": "3",
            "amount": 20
          }],
          "peroxide": "6%",
          "peroxide_amount": 20,
          "description": "-",
          "type": "Color"
        }]
      }]
    }
  }

  static getEvent() {
    return {
      "modified": "2017-09-27T09:53:20.449Z",
      "id": "f0759a28-0781-425a-TEST-f2f4cad04807",
      "start": "2017-08-01T04:30:00.000Z",
      "end": "2017-08-01T05:00:00.000Z",
      "client_id": "028add25-79b7-4019-TEST-76b84caab785",
      "style_id": "f08f0fbd-9383-4840-TEST-f037bce4aeff",
      "paid": 25,
      "user_id": "d45b8403-e248-4858-TEST-c3fa9284faa2"
    }
  }

  static getProfile() {
    return {
      "name": "Products List Test",
      "modified": "2017-12-18T10:09:11.071Z",
      "bowlTypes": [{
        "label": "Foils"
      }],
      "colours": [{
        "label": "3017"
      }],
      "treatments": [{
        "label": "Toner 30g (extra $5)"
      }],
      "peroxides": [{
        "label": "Activator"
      }],
      "products": [{
        "label": "TEST Paste",
        "price": 19.99
      }],
      "id": "6a01587c-ac9b-41f3-TEST-2cbbed95f63c"
    }
  }

  static getUser() {
    return {
      "id": "615f9c60-db01-46d6-TEST-9e01b7a0fa94",
      "modified": "2017-12-18T10:09:11.071Z",
      "name": "Test",
      "email": "new@gmail.com",
      "phone": "",
      "permissions": {
        "role": "admin"
      },
      "changepassword": "newtest",
      "password_last_updated": 1513591751312,
      "colour": "user-green",
      "settings": {
        "hiddenDays": [0, 6],
        "businessHours": {
          "dow": [1, 2, 3, 4, 5],
          "start": "09:00",
          "end": "17:00"
        }
      }
    }
  }
}