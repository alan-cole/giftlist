/**
 * @jest-environment node
 */
const API = require('../setup/scripts/api')
const api = new API('http://localhost:3000')

describe('Friends', () => {

  beforeAll(async () => {
    await api.register('test-friend@gmail.com', 'testpassword1', 'test-friend')
    await api.register('test-user@gmail.com', 'testpassword1', 'test-user')
    await api.login('test-user@gmail.com', 'testpassword1')
  })

  test('add a friend', async () => {
    const result = await api.addFriend('test-friend@gmail.com')
    expect(result).toEqual({ 'error': false, 'message': 'Added friends' })
  }, 10000)

  test('get friend', async () => {
    const result = await api.getFriends()
    expect(result).toHaveProperty('error', false)
    expect(result).toHaveProperty('message', 'Got friends')
    expect(result).toHaveProperty('result')
    expect(result.result[0]).toHaveProperty('_id')
    expect(result.result[0]).toHaveProperty('name', 'test-friend')
  }, 10000)

  test('delete friend', async () => {
    const friends = await api.getFriends()
    const result = await api.deleteFriend(friends.result[0]._id)
    expect(result).toEqual({ 'error': false, 'message': 'Deleted friends' })
  }, 10000)

  afterAll(async () => {
    await api.unregister()
    await api.login('test-friend@gmail.com', 'testpassword1')
    await api.unregister()
  })
})
