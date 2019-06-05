/**
 * @jest-environment node
 */
const API = require('../setup/scripts/api')
const api = new API('http://localhost:3000')

describe("Registration", () => {
  test('register an account', async () => {
    const result = await api.register('test@gmail.com', 'testpassword1', 'test')
    expect(result).toEqual({ "error": false, "message": "Added users" })
  }, 10000)

  test('fail to register a duplicate account', async () => {
    const result = await api.register('test@gmail.com', 'testpassword1', 'test')
    expect(result).toEqual({ "error": true, "message": "Email already in use" })
  }, 10000)

  test('unregister an account', async () => {
    await api.login('test@gmail.com', 'testpassword1')
    const result = await api.unregister()
    expect(result).toEqual({ "error": false, "message": "Deleted users" })
  }, 10000)
})
