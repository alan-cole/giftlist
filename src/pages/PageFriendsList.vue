<template>
  <div :class="{ 'loading': !loaded }">
    <top-menu previousPage="/menu" title="Friend's Gift List" />
    <div v-if="loaded" class="container">
      <ul v-if="friends.length > 0" class="list">
        <li v-for="(friend, friendIndex) in friends" :key="`friend-${friendIndex}`" class="nav-item__group">
          <span class="nav-item__title">{{ friend.name }}</span>
          <ul v-if="friend.gifts.length > 0" class="list">
            <li v-for="(gift, giftIndex) in friend.gifts" :key="`friend-${friendIndex}-gift-${giftIndex}`" class="nav-item">
              <div>
                <a v-if="gift.link" :href="gift.link" target="_blank">{{ gift.name }}</a>
                <span v-else>{{ gift.name }}</span>
                <div class="nav-item__sub-item" v-if="gift.price">
                  <span>${{ gift.price }}</span>
                </div>
              </div>
              <div class="buyer-list__wrapper">
                <ul v-if="gift.buyers" class="buyer-list">
                  <li v-for="(buyer, buyerIndex) in gift.buyers" :key="`friend-${friendIndex}-gift-${giftIndex}-buyer-${buyerIndex}`" class="buyer-list__item" :class="{ 'buyer-list__item--self': buyer.self }">
                    <span>{{ buyer.name }}</span>
                    <span v-if="buyer.self">(me)</span>
                  </li>
                </ul>
                <button v-if="!selfIsBuyer(gift.buyers)" @click="buyGift(gift)" class="nav-item__btn nav-item__btn--unchecked" :disabled="isSaving">Buy</button>
                <button v-if="selfIsBuyer(gift.buyers)" @click="unbuyGift(gift)" class="nav-item__btn nav-item__btn--checked" :disabled="isSaving">Don't buy</button>
              </div>
            </li>
          </ul>
          <div v-else>No gifts on their list.</div>
        </li>
      </ul>
      <div v-else>You haven't added any friends.</div>
    </div>
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
      loaded: false,
      isSaving: false,
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
      this.isSaving = true
      const result = await api.addBuyer(gift._id)
      if (!result.error) {
        await this.loadFriends()
      }
      this.isSaving = false
    },
    async unbuyGift (gift) {
      this.isSaving = true
      const result = await api.deleteBuyer(gift._id)
      if (!result.error) {
        await this.loadFriends()
      }
      this.isSaving = false
    },
    async loadFriends () {
      const friends = await api.getFriendsGiftList()
      if (!friends.error) {
        this.friends = friends.result
        this.loaded = true
      }
    }
  },
  async created () {
    this.loadFriends()
  }
}
</script>
