/**
 * @jest-environment node
 */
const KCHSData = require('./assets/data.js')

describe("Export: /api", () => {
  test('export data as zip', async () => {
    const token = await KCHSData.getLoginToken()
    const pathResult = await KCHSData.post('api', {
      token: token,
      request: 'export'
    })
    expect(pathResult.data).toHaveProperty('error', false)
    expect(pathResult.data).toHaveProperty('message', 'Prepared an export URL')
    expect(pathResult.data.result).toHaveProperty('path')

    const dataResult = await KCHSData.get(pathResult.data.result.path)
    expect(dataResult.headers['content-type']).toEqual('application/zip')
  }, 10000)
})
