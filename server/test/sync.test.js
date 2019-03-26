/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')

describe("Sync: /api", () => {
  test('sync as admin', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'sync',
      options: `{
        "last_update":null,
        "event_start":"2017-11-01T00:00:00+11:00",
        "event_end":"2017-11-02T00:00:00+11:00"
      }`
    })
    expect(result.data).toHaveProperty('error', false)
    expect(result.data).toHaveProperty('message', 'Synced')
    expect(result.data).toHaveProperty('result')
    expect(result.data.result).toHaveProperty('last_update')
    expect(result.data.result).toHaveProperty('clients')
    expect(result.data.result).toHaveProperty('events')
    expect(result.data.result).toHaveProperty('users')
    expect(result.data.result).toHaveProperty('profiles')
  }, 15000)
})
