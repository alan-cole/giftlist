/**
 * @jest-environment node
 */

const DBConnector = require('../src/db')
const database = new DBConnector()
const KCHSData = require('./assets/data.js')
const account = KCHSData.getAccount()

describe("Database Connector", () => {
  test('add user', async () => {
    await database.initAsync(account.database.db_username, account.database.db_password, account.database.db_host)
    const result = await database.addAsync('user', KCHSData.getUser())
    database.endAsync()

    expect(result).toEqual({
      "error": false,
      "message": "Added user"
    })
  }, 10000)

  test('delete user', async () => {
    await database.initAsync(account.database.db_username, account.database.db_password, account.database.db_host)
    const result = await database.deleteAsync('user', KCHSData.getUser().id)
    database.endAsync()

    expect(result).toEqual({
      "error": false,
      "message": "Deleted user"
    })
  }, 10000)
})
