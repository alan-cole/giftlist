/**
 * @jest-environment node
 */
const moment = require('moment-timezone')
const KCHSData = require('./assets/data.js')

function client(date) {
  let clientData = KCHSData.getClient()
  clientData.id = 'ID_TEST_CLIENT_FOR_CONFLICT'
  if (date) {
    clientData.modified = moment(date).toISOString()
  }
  return JSON.stringify(clientData)
}

let retrievedClient = null

describe("Conflicts: /api", () => {
  test('create a new client', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_client',
      client: client()
    })
    expect(result.data).toHaveProperty('error', false)
    expect(result.data).toHaveProperty('message', "Added client")
  }, 10000)

  test('get client from server', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'sync',
      options: `{
        "last_update":null,
        "event_start":"${moment().subtract(1, 'years').toISOString()}",
        "event_end":"${moment().add(1, 'years').toISOString()}"
      }`
    })
    result.data.result.clients.forEach(item => {
      if (item.id === 'ID_TEST_CLIENT_FOR_CONFLICT') {
        retrievedClient = item
      }
    })
    expect(retrievedClient).not.toBeNull()
    expect(result.data).toHaveProperty('error', false)
    expect(result.data).toHaveProperty('message', 'Synced')
    expect(result.data).toHaveProperty('result')
  }, 10000)

  test('update client using same server modified date (no collision)', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_client',
      client: client(retrievedClient.modified)
    })
    expect(result.data).toHaveProperty('error', false)
    expect(result.data).toHaveProperty('message', "Added client")
  }, 10000)

  test('update client using newer-than-server date (no collision)', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_client',
      client: client(moment().add(1, 'day'))
    })
    expect(result.data).toHaveProperty('error', false)
    expect(result.data).toHaveProperty('message', "Added client")
  }, 10000)

  test('update client using older-than-server date (collision)', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'add_client',
      client: client(moment().subtract(1, 'day'))
    })
    expect(result.data).toHaveProperty('error', true)
    expect(result.data).toHaveProperty('message', "The remote client is newer")
    expect(result.data).toHaveProperty('collection', "client")
    expect(result.data).toHaveProperty('conflict', true)
    expect(result.data).toHaveProperty('remote')
  }, 10000)

  test('delete client', async () => {
    const token = await KCHSData.getLoginToken()
    const result = await KCHSData.post('api', {
      token: token,
      request: 'delete_client',
      client_id: 'ID_TEST_CLIENT_FOR_CONFLICT'
    })
    expect(result.data).toEqual({
      "error": false,
      "message": "Deleted client"
    })
  }, 10000)

})
