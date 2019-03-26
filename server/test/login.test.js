/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')
const account = KCHSData.getAccount()

describe("Login: /login", () => {

  test('login to dev as admin', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev',
      username: account.user.username,
      password: account.user.password
    })
    expect(result.data).toHaveProperty('error', false)
    expect(result.data).toHaveProperty('message', 'Access granted')
    expect(result.data.result).toHaveProperty('token')
    expect(result.data.result).toHaveProperty('id')
    expect(result.data.result).toHaveProperty('name', account.user.name)
  })

})
