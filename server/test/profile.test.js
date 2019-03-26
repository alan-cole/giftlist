/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')

describe("Profile: /api", () => {
  test('add profile as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_profile',
      profile: JSON.stringify(KCHSData.getProfile())
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Added profile"
    })
  }, 10000)

  test('delete profile as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'delete_profile',
      profile_id: KCHSData.getProfile().id
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Deleted profile"
    })
  }, 10000)
})
