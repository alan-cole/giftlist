<template>
  <div :class="{ 'loading': !loaded }">
    <top-menu previousPage="/menu" title="Friend's Gift List" />
    <div v-if="loaded" class="container">
      <ul v-if="friends.length > 0" class="list">
        <li v-for="(friend, friendIndex) in friends" :key="`friend-${friendIndex}`" class="nav-item__group">
          <div class="accordion">
            <button
              class="accordion__toggle"
              :class="{ 'accordion__toggle--expanded': friend.isExpanded }"
              @click="friend.isExpanded = !friend.isExpanded"
            >
              <span>{{ friend.name }}</span>
              <span>({{ friend.boughtGifts }} / {{ friend.unboughtGifts }})</span>
            </button>
            <div class="accordion__container" :class="{ 'accordion__container--expanded': friend.isExpanded }">
              <ul v-if="friend.gifts.length > 0" class="list">
                <li v-for="(gift, giftIndex) in friend.gifts" :key="`friend-${friendIndex}-gift-${giftIndex}`" class="nav-item">
                  <div class="nav-item__details">
                    <a v-if="gift.link" :href="gift.link" target="_blank">{{ gift.name }}</a>
                    <span v-else>{{ gift.name }}</span>
                    <div class="nav-item__sub-item" v-if="gift.price">
                      <span>${{ gift.price }}</span>
                    </div>
                    <div>
                      <ul v-if="gift.buyers" class="buyer-list">
                        <li
                          v-for="(buyer, buyerIndex) in gift.buyers"
                          :key="`friend-${friendIndex}-gift-${giftIndex}-buyer-${buyerIndex}`"
                          class="buyer-list__item"
                          :class="{
                            'buyer-list__item--self': buyer.self,
                            'buyer-list__item--solid': getBuyStateLabel(buyer.state) === 'bought'
                          }"
                        >
                          <span>{{ buyer.name }}</span>
                          <span>- {{ getBuyStateLabel(buyer.state) }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <button
                      class="small-button"
                      :class="{
                        'small-button--solid': buyState(gift.buyers) === 'bought',
                        'small-button--warn': buyState(gift.buyers) === 'unbuy'
                      }"
                      @click="toggleBuyState(gift)"
                      :disabled="isSaving"
                    >➜ {{ buyState(gift.buyers) }}</button>
                  </div>
                </li>
              </ul>
              <div v-else class="nav-item__no-gifts">No gifts on their list.</div>
            </div>
          </div>
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
    getSelfBuyer (buyers) {
      return buyers ? buyers.filter(buyer => buyer.self)[0] : null
    },
    getBuyStateLabel (state) {
      let rtn = ''
      switch (state) {
        case undefined:
        case 0:
        case 1:
          rtn = 'planning'
          break
        case 2:
          rtn = 'bought'
          break
        case 3:
          rtn = 'unbuy'
          break
        default:
          break
      }
      return rtn
    },
    buyState (buyers) {
      const buyer = this.getSelfBuyer(buyers)
      return this.getBuyStateLabel(buyer ? buyer.state + 1 : 0)
    },
    async toggleBuyState (gift) {
      this.isSaving = true
      const buyer = this.getSelfBuyer(gift.buyers)
      const state = buyer ? (buyer.state || 0) : 0
      let result = null
      if (state === 2) {
        result = await api.deleteBuyer(gift._id)
      } else if (state === 1) {
        result = await api.updateBuyer(buyer._id, state + 1)
      } else {
        result = await api.addBuyer(gift._id, state + 1)
      }
      if (!result.error) {
        await this.loadFriends()
      }
      this.isSaving = false
    },
    async loadFriends () {
      const friends = await api.getFriendsGiftList()
      if (!friends.error) {
        // Sort A-Z
        friends.result.sort((a, b) => {
          const nA = a.name.toUpperCase()
          const nB = b.name.toUpperCase()
          return nA > nB ? 1 : (nA < nB ? -1 : 0)
        })
        friends.result.forEach(friend => {
          let unbought = 0
          let bought = 0
          friend.gifts.forEach(gift => {
            if (gift.buyers && gift.buyers.length > 0) {
              gift.buyers.forEach(buyer => {
                if (buyer.self) {
                  bought++
                }
              })
            } else {
              unbought++
            }
          })
          friend.boughtGifts = bought
          friend.unboughtGifts = unbought
        })
        if (this.friends.length > 0) {
          // Reloading? Remember expanded accordions
          this.friends.forEach((item, idx) => { friends.result[idx].isExpanded = item.isExpanded })
        } else {
          // First time? Collapse all
          friends.result.forEach(friend => { friend.isExpanded = false })
        }
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
