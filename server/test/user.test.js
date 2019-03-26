/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')

describe("User: /api", () => {
  test('add user as admin with changepassword', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_user',
      user: JSON.stringify(KCHSData.getUser())
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Added user"
    })
  }, 10000)

  test('delete user as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'delete_user',
      user_id: KCHSData.getUser().id
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Deleted user"
    })
  }, 10000)
})
