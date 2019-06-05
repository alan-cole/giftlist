/**
 * @jest-environment node
 */
const API = require('../setup/scripts/api')
const api = new API('http://localhost:3000')

describe("Gifts", () => {

  beforeAll(async () => {
    await api.register('test-gifts@gmail.com', 'testpassword1', 'test')
    await api.login('test-gifts@gmail.com', 'testpassword1')
  })

  test('add a gift', async () => {
    const result = await api.addGift({ name: 'Test gift 1', link: 'http://duckduckgo.com', price: '29.95' })
    expect(result).toEqual({ "error": false, "message": "Added gifts" })
  }, 10000)

  test('get gift', async () => {
    const result = await api.getGifts()
    expect(result).toHaveProperty("error", false)
    expect(result).toHaveProperty("message", "Found gifts")
    expect(result).toHaveProperty("result")
    expect(result.result[0]).toHaveProperty("_id")
    expect(result.result[0]).toHaveProperty("link", "http://duckduckgo.com")
    expect(result.result[0]).toHaveProperty("name", "Test gift 1")
    expect(result.result[0]).toHaveProperty("price", "29.95")
    expect(result.result[0]).toHaveProperty("user")
  }, 10000)

  test('delete gift', async () => {
    const gifts = await api.getGifts()
    const result = await api.deleteGift(gifts.result[0]._id)
    expect(result).toEqual({ "error": false, "message": "Deleted gifts" })
  }, 10000)

  afterAll(async () => {
    await api.unregister()
  })
})
