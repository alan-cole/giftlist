/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')
const account = KCHSData.getAccount()

describe("Set Password: /setpassword", () => {
  test('set new password as admin', async () => {
    const result = await KCHSData.post('setpassword', {
      domain: 'dev',
      username: account.user.username,
      password: account.user.password,
      newpassword: 'TEST'
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Set password"
    })
  }, 10000)

  test('login with new password as admin', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev',
      username: account.user.username,
      password: 'TEST'
    })
    expect(result.data).toHaveProperty('error', false)
  }, 10000)

  test('set password back to original as admin', async () => {
    const result = await KCHSData.post('setpassword', {
      domain: 'dev',
      username: account.user.username,
      password: 'TEST',
      newpassword: account.user.password
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Set password"
    })
  }, 10000)

  test('login with original as admin', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev',
      username: account.user.username,
      password: account.user.password
    })
    expect(result.data).toHaveProperty('error', false)
  })

  test('fail to login to dev with new password as admin', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev',
      username: account.user.username,
      password: 'TEST'
    })
    expect(result.data).toEqual({
      "error": true,
      "message": "Access denied"
    })
  })

})
