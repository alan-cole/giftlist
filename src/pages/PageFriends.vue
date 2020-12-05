<template>
  <div>
    <top-menu previousPage="/menu" title="Friends" />
    <ul>
      <li v-for="(friend, index) in friends" :key="index">
        <span>{{ friend.name }}</span>
        <router-link :to="{ name: 'PageAddFriend', params: { friend } }">Edit {{ friend.name }}</router-link>
      </li>
    </ul>
    <router-link class="button" to="/addfriend">Add Friend</router-link>
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
      friends: []
    }
  },
  async created () {
    const friends = await api.getFriends()
    if (!friends.error) {
      this.friends = friends.result
    }
  }
}
</script>
