<template>
  <div>
    <top-menu previousPage="/menu" title="Friends" />
    <div v-if="loaded" class="container">
      <h2>My friends</h2>
      <ul v-if="friends.length > 0" class="list">
        <li v-for="(friend, index) in friends" :key="index" class="nav-item">
          <span>{{ friend.name }}</span>
          <button class="nav-item__btn nav-item__btn--delete" @click="deleteFriend(friend)">Delete {{ friend.name }}</button>
        </li>
      </ul>
      <div v-else>You haven't added any friends.</div>
      <router-link class="button" to="/addfriend">Add Friend</router-link>
      <h2>Friended by</h2>
      <ul v-if="friendedBy.length > 0" class="list">
        <li v-for="(user, index) in friendedBy" :key="index" class="nav-item">
          <span>{{ user.name }}</span>
          <button v-if="!user.isFriend" class="nav-item__btn nav-item__btn--add" @click="addFriend(user)">Add {{ user.name }}</button>
        </li>
      </ul>
      <div v-else>You are not friended by anyone.</div>
    </div>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageFriends',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      friends: [],
      friendedBy: [],
      loaded: false
    }
  },
  methods: {
    async deleteFriend (friend) {
      const userInput = confirm(`Are you sure you want to delete ${friend.name}?`)
      if (userInput) {
        const result = await api.deleteFriend(friend._id)
        if (!result.error) {
          this.loadFriends()
        } else {
          alert(`An error occured: ${result.message}`)
        }
      }
    },
    async loadFriends () {
      // Load my friends
      const friends = await api.getFriends()
      if (!friends.error) {
        this.friends = friends.result
      }

      // Load users who added me as a friend
      const friendedBy = await api.getFriendedUsers()
      if (!friendedBy.error) {
        const friendedUsers = friendedBy.result
        this.friendedBy = friendedUsers.map(user => {
          let isFriend = false
          this.friends.forEach(friend => {
            if (friend._id === user._id) {
              isFriend = true
            }
          })
          return {
            _id: user._id,
            name: user.name,
            username: user.username,
            isFriend: isFriend
          }
        })
      }
    },
    async addFriend (user) {
      const result = await api.addFriend(user.username)
      if (!result.error) {
        this.loadFriends()
      } else {
        alert(`An error occured: ${result.message}`)
      }
    }
  },
  async created () {
    this.loaded = false
    await this.loadFriends()
    this.loaded = true
  }
}
</script>
