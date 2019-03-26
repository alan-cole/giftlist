/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')

describe("Event: /api", () => {
  test('add event as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_event',
      event: JSON.stringify(KCHSData.getEvent())
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Added event"
    })
  }, 10000)

  test('delete event as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'delete_event',
      event_id: KCHSData.getEvent().id
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Deleted event"
    })
  }, 10000)
})
