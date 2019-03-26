/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')
const fs = require('fs')

describe("Import: /api", () => {
  test('import data as zip', async () => {
    const importableData = fs.readFileSync('./test/assets/import.zip', 'base64')
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'import',
      data: importableData,
      options: {
        clear_data: true,
        import_clients: true,
        import_events: true,
        import_users: true,
        import_profiles: true
      }
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Imported data"
    })
  }, 10000)
})