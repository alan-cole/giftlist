<template>
  <Layout :loaded="loaded" previous-page="/menu" title="Friend's Gift List">
    <ul v-if="friends.length > 0" class="friend-list">
      <li v-for="(friend, friendIndex) in friends" :key="`friend-${friendIndex}`">
        <Accordion :label="`${friend.name} (${friend.boughtGifts} / ${friend.unboughtGifts})`">
          <ul v-if="friend.gifts.length > 0" class="friend-list__accordion-list">
            <li v-for="(gift, giftIndex) in friend.gifts" :key="`friend-${friendIndex}-gift-${giftIndex}`">
              <GiftList
                :gift-id="`friend-${friendIndex}-gift-${giftIndex}`"
                :gift="gift"
                :disabled="isSaving"
                @buy="toggleBuyState"
              />
            </li>
          </ul>
          <div v-else class="friend-list__no-items">No gifts on their list.</div>
        </Accordion>
      </li>
    </ul>
    <div v-else>You haven't added any friends.</div>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import Layout from '../components/Layout.vue'
import Accordion from '../components/Accordion.vue'
import GiftList from '../components/GiftList.vue'

export default {
  name: 'PageFriendsList',
  components: {
    Layout,
    Accordion,
    GiftList
  },
  data () {
    return {
      loaded: false,
      isSaving: false,
      friends: []
    }
  },
  methods: {
    async toggleBuyState (gift, buyer, state) {
      this.isSaving = true
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

<style lang="scss">
@import '../scss/_variables.scss';

.friend-list {
  padding: 0;
  margin: 0;
  list-style: none;

  & > li {
    margin-bottom: 24px;
  }

  &__accordion-list {
    padding: 0;
    margin: 0;
    list-style: none;

    & > li {
      &:nth-child(even) {
        background-color: $background-alt;
      }
    }
  }

  &__no-items {
    color: $foreground;
    font-family: $default-font;
    padding: 12px 0;
    padding-left: 8px;
  }
}

</style>
