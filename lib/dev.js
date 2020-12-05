const Connector = require('./connector')
const api = new Connector('http://localhost:3000')

async function logout () {
  api.logout()
}

async function addUsers () {
  await api.register('steve@gmail.com', 'XXsteve', 'steve')
  await api.register('mark@gmail.com', 'XXmark', 'mark')
  await api.register('john@gmail.com', 'XXjohn', 'john')
  await api.register('luke@gmail.com', 'XXluke', 'luke')
  await api.register('james@gmail.com', 'XXjames', 'james')
}

async function setup () {
  await addUsers()

  await api.login('steve@gmail.com', 'XXsteve')
  await api.addGift({ name: 'Final fantasy', link: 'http://duckduckgo.com', price: '49.95' })
  await api.addGift({ name: 'Resident evil', link: 'http://duckduckgo.com', price: '89.95' })
  await api.addGift({ name: 'Game of Thrones', link: 'http://duckduckgo.com', price: '25' })
  await api.addFriend('john@gmail.com')
  await api.addFriend('luke@gmail.com')
  await api.addFriend('james@gmail.com')
  await logout()

  await api.login('john@gmail.com', 'XXjohn')
  await api.addGift({ name: 'Pokemon', link: 'http://duckduckgo.com', price: '49.95' })
  await api.addGift({ name: 'The Matrix', link: 'http://duckduckgo.com', price: '25' })
  await api.addGift({ name: 'The Simpsons', link: 'http://duckduckgo.com', price: '25' })
  await api.addFriend('steve@gmail.com')
  await api.addFriend('mark@gmail.com')
  await logout()

  await api.login('steve@gmail.com', 'XXsteve')
  const friendsGifts = await api.getFriendsGiftList()
  await api.addBuyer(friendsGifts.result[0].gifts[0]._id)
  await api.addBuyer(friendsGifts.result[0].gifts[2]._id)
  await logout()
}

async function getStuff () {
  await api.login('steve@gmail.com', 'XXsteve')
  // console.log(await api.getGifts())
  console.log(await api.getFriends())
  console.log(JSON.stringify(await api.getFriendsGiftList(), null, 2))
  await logout()
}

// Deleteing
// console.log(await api.deleteGift(getGiftResp[0]._id))
// console.log(await api.deleteFriend(getFriendResp[0]._id))

setup()
// getStuff()
