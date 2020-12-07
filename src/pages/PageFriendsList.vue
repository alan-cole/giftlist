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
            <ul v-if="gift.buyers">
              <li v-for="(buyer, buyerIndex) in gift.buyers" :key="`friend-${friendIndex}-gift-${giftIndex}-buyer-${buyerIndex}`">
                <span>{{ buyer.name }}</span>
                <span v-if="buyer.self">(me)</span>
              </li>
            </ul>
            <button v-if="!selfIsBuyer(gift.buyers)" @click="buyGift(gift)">Buy</button>
            <button v-if="selfIsBuyer(gift.buyers)" @click="unbuyGift(gift)">Don't buy</button>
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
  methods: {
    selfIsBuyer (buyers) {
      let hasMe = false
      if (buyers) {
        buyers.forEach(buyer => {
          if (buyer.self) {
            hasMe = true
          }
        })
      }
      return hasMe
    },
    async buyGift (gift) {
      const result = await api.addBuyer(gift._id)
      if (!result.error) {
        this.loadFriends()
      }
    },
    async unbuyGift (gift) {
      const result = await api.deleteBuyer(gift._id)
      if (!result.error) {
        this.loadFriends()
      }
    },
    async loadFriends () {
      const friends = await api.getFriendsGiftList()
      if (!friends.error) {
        this.friends = friends.result
      }
    }
  },
  async created () {
    this.loadFriends()
  }
}
</script>
