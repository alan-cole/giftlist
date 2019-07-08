/**
 * @jest-environment node
 */
const Connector = require('../../lib/connector')
const api = new Connector('http://localhost:3000')

describe('Gifts', () => {

  beforeAll(async () => {
    await api.register('test-gifts@gmail.com', 'testpassword1', 'test')
    await api.login('test-gifts@gmail.com', 'testpassword1')
  })

  test('add a gift', async () => {
    const result = await api.addGift({ name: 'Test gift 1', link: 'http://duckduckgo.com', price: '29.95' })
    expect(result).toEqual({ 'error': false, 'message': 'Added gifts' })
  }, 10000)

  test('get gift', async () => {
    const result = await api.getGifts()
    expect(result).toHaveProperty('error', false)
    expect(result).toHaveProperty('message', 'Found gifts')
    expect(result).toHaveProperty('result')
    expect(result.result[0]).toHaveProperty('_id')
    expect(result.result[0]).toHaveProperty('link', 'http://duckduckgo.com')
    expect(result.result[0]).toHaveProperty('name', 'Test gift 1')
    expect(result.result[0]).toHaveProperty('price', '29.95')
    expect(result.result[0]).toHaveProperty('user')
  }, 10000)

  test('update a gift', async () => {
    const gifts = await api.getGifts()
    const giftId = gifts.result[0]._id
    const result = await api.updateGift(giftId, { name: 'Test gift 1 Update', link: 'http://duckduckgo.com/update', price: '50' })
    expect(result).toEqual({ 'error': false, 'message': 'Updated gifts' })
    const updatedGifts = await api.getGifts()
    expect(updatedGifts.result[0]).toHaveProperty('_id', giftId)
    expect(updatedGifts.result[0]).toHaveProperty('link', 'http://duckduckgo.com/update')
    expect(updatedGifts.result[0]).toHaveProperty('name', 'Test gift 1 Update')
    expect(updatedGifts.result[0]).toHaveProperty('price', '50')
    expect(updatedGifts.result[0]).toHaveProperty('user')
  }, 10000)

  test('delete gift', async () => {
    const gifts = await api.getGifts()
    const result = await api.deleteGift(gifts.result[0]._id)
    expect(result).toEqual({ 'error': false, 'message': 'Deleted gifts' })
  }, 10000)

  afterAll(async () => {
    await api.unregister()
  })
})
