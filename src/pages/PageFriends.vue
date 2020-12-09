<template>
  <div>
    <top-menu previousPage="/menu" title="Friends" />
    <div v-if="loaded" class="container">
      <ul class="list">
        <li v-for="(friend, index) in friends" :key="index" class="nav-item">
          <span>{{ friend.name }}</span>
          <button class="nav-item__btn nav-item__btn--delete" @click="deleteFriend(friend)">Delete {{ friend.name }}</button>
        </li>
      </ul>
      <router-link class="button" to="/addfriend">Add Friend</router-link>
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
      const friends = await api.getFriends()
      if (!friends.error) {
        this.friends = friends.result
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
