/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')
const account = KCHSData.getAccount()

describe("Stress Login: /login", () => {

  test('fail login to dev with no data', async () => {
    const result = await KCHSData.post('login')
    expect(result.data).toHaveProperty('error', true)
    expect(result.data).toHaveProperty('message', 'Access denied')
  })

  test('fail login to dev with no username or password', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev'
    })
    expect(result.data).toHaveProperty('error', true)
    expect(result.data).toHaveProperty('message', 'Access denied')
  })

  test('fail login to dev with incorrect username', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev',
      username: 'test',
      password: account.user.password
    })
    expect(result.data).toHaveProperty('error', true)
    expect(result.data).toHaveProperty('message', 'Access denied')
  })

  test('fail login to dev with incorrect password', async () => {
    const result = await KCHSData.post('login', {
      domain: 'dev',
      username: account.user.username,
      password: 'test'
    })
    expect(result.data).toHaveProperty('error', true)
    expect(result.data).toHaveProperty('message', 'Access denied')
  })
})

describe("Stress Client: /api", () => {
  test('add client with invalid json', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_client',
      client: `{
        "id": "94e83e80-cc55-4f9e-TEST-0ffa98bd4183"
        "name": "Test Client"
      }`
    })
    expect(result.data).toEqual({
      "error": true,
      "message": "Internal server error processing the request"
    })
  }, 10000)

  test('delete client with no id defined', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'delete_client'
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Deleted client"
    })
  }, 10000)

})
