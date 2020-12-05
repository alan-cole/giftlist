<template>
  <div>
    <top-menu previousPage="/menu" title="Friend's List" />
    <ul>
      <li v-for="(friend, friendIndex) in friends" :key="`friend-${friendIndex}`">
        <span>{{ friend.name }}</span>
        <ul>
          <li v-for="(gift, giftIndex) in friend.gifts" :key="`friend-${friendIndex}-gift-${giftIndex}`">
            <a v-if="gift.link" :href="gift.link" target="_blank">{{ gift.name }}</a>
            <span>{{ gift.price }}</span>
            <span>{{ gift.buyers }}</span>
            <button>Buy</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageFriendsList',
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
    const friends = await api.getFriendsGiftList()
    if (!friends.error) {
      this.friends = friends.result
    }
  }
}
</script>
