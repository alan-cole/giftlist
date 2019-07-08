/**
 * @jest-environment node
 */
const Connector = require('../../lib/connector')
const api = new Connector('http://localhost:3000')

describe('Gift List', () => {

  beforeAll(async () => {
    await api.register('test-friend@gmail.com', 'testpassword1', 'test-friend')
    await api.login('test-friend@gmail.com', 'testpassword1')
    await api.addGift({ name: 'Test gift 1', link: 'http://duckduckgo.com', price: '29.95' })
    await api.logout()
    await api.register('test-user@gmail.com', 'testpassword1', 'test-user')
    await api.login('test-user@gmail.com', 'testpassword1')
    await api.addFriend('test-friend@gmail.com')
  })

  test('add a buyer', async () => {
    const giftlist = await api.getFriendsGiftList()
    const result = await api.addBuyer(giftlist.result[0]['gifts'][0]._id)
    expect(result).toEqual({ 'error': false, 'message': 'Added buyers' })
  }, 10000)

  test('get friends gift list', async () => {
    const result = await api.getFriendsGiftList()
    expect(result).toHaveProperty('error', false)
    expect(result).toHaveProperty('message', 'Got friends gift list')
    expect(result).toHaveProperty('result')
    expect(result.result[0]).toHaveProperty('_id')
    expect(result.result[0]).toHaveProperty('name', 'test-friend')
    expect(result.result[0]).toHaveProperty('gifts')
    expect(result.result[0]['gifts'][0]).toHaveProperty('_id')
    expect(result.result[0]['gifts'][0]).toHaveProperty('name', 'Test gift 1')
    expect(result.result[0]['gifts'][0]).toHaveProperty('link', 'http://duckduckgo.com')
    expect(result.result[0]['gifts'][0]).toHaveProperty('price', '29.95')
    expect(result.result[0]['gifts'][0]).toHaveProperty('buyers')
    expect(result.result[0]['gifts'][0]['buyers'][0]).toHaveProperty('name', 'test-user')
    expect(result.result[0]['gifts'][0]['buyers'][0]).toHaveProperty('self', true)
  }, 10000)

  test('delete buyer', async () => {
    const giftlist = await api.getFriendsGiftList()
    const result = await api.deleteBuyer(giftlist.result[0]['gifts'][0]._id)
    expect(result).toEqual({ 'error': false, 'message': 'Deleted buyers' })
  }, 10000)

  afterAll(async () => {
    const friends = await api.getFriends()
    await api.deleteFriend(friends.result[0]._id)
    await api.unregister()
    await api.login('test-friend@gmail.com', 'testpassword1')
    const gifts = await api.getGifts()
    await api.deleteGift(gifts.result[0]._id)
    await api.unregister()
  })
})
