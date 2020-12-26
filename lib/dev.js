const Connector = require('./connector')
const api = new Connector('http://localhost:3000')

async function logout () {
  api.logout()
}

async function addUsers () {
  await api.register('steve', 'xxsteve', 'Steve', 'steve@gmail.com', 'demo')
  await api.register('mark', 'xxmark', 'Mark', 'mark@gmail.com', 'demo')
  await api.register('john', 'xxjohn', 'John', 'john@gmail.com', 'demo')
  await api.register('luke', 'xxluke', 'Luke', 'luke@gmail.com', 'demo')
  await api.register('james', 'xxjames', 'James', 'james@gmail.com', 'demo')
}

async function setup () {
  await addUsers()

  await api.login('steve', 'xxsteve')
  await api.addGift({ name: 'Final fantasy', link: 'http://duckduckgo.com', price: '49.95' })
  await api.addGift({ name: 'Resident evil', link: 'http://duckduckgo.com', price: '89.95' })
  await api.addGift({ name: 'Game of Thrones', link: 'http://duckduckgo.com', price: '25' })
  await api.addFriend('john')
  await api.addFriend('luke')
  await api.addFriend('james')
  await logout()

  await api.login('john', 'xxjohn')
  await api.addGift({ name: 'Pokemon', link: 'http://duckduckgo.com', price: '49.95' })
  await api.addGift({ name: 'The Matrix', link: 'http://duckduckgo.com', price: '25' })
  await api.addGift({ name: 'The Simpsons', link: 'http://duckduckgo.com', price: '25' })
  await api.addFriend('steve')
  await api.addFriend('mark')
  await logout()

  await api.login('mark', 'xxmark')
  await api.addFriend('john')
  await logout()

  await api.login('steve', 'xxsteve')
  const friendsGifts = await api.getFriendsGiftList()
  await api.addBuyer(friendsGifts.result[0].gifts[0]._id)
  await api.addBuyer(friendsGifts.result[0].gifts[2]._id)
  await logout()
}

async function getStuff () {
  await api.login('steve', 'xxsteve')
  // console.log(await api.getGifts())
  console.log(await api.getFriends())
  console.log(JSON.stringify(await api.getFriendsGiftList(), null, 2))
  await logout()
}

async function updateUser () {
  await api.login('steve', 'xxsteve')
  const resp = await api.updateUser('steve', 'xxsteve', 'updatedsteve@gmail.com')
  console.log(resp)
  await logout()
}

// Deleteing
// console.log(await api.deleteGift(getGiftResp[0]._id))
// console.log(await api.deleteFriend(getFriendResp[0]._id))

// addUsers()
setup()
// getStuff()
// updateUser()
