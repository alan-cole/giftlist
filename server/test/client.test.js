/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')

describe("Client: /api", () => {
  test('add client as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_client',
      client: JSON.stringify(KCHSData.getClient())
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Added client"
    })
  }, 10000)

  test('delete client as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'delete_client',
      client_id: KCHSData.getClient().id
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Deleted client"
    })
  }, 10000)

})
