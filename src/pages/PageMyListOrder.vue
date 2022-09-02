<template>
  <div :class="{ 'loading': !loaded }">
    <top-menu previousPage="/mylist" title="Order My Gifts" />
    <div v-if="loaded" class="container">
      <ul v-if="gifts.length > 0" class="list">
        <li v-for="(gift, index) in gifts" :key="gift.order" class="nav-item">
          <button @click="up(index)" class="arrow-button arrow-button--up" :disabled="isSaving || index === 0">
            <span>Up</span>
          </button>
          <button @click="down(index)" class="arrow-button arrow-button--down" :disabled="isSaving || index === gifts.length - 1">
            <span>Down</span>
          </button>
          <div class="nav-item__label">{{ gift.name }}</div>
        </li>
      </ul>
      <p v-else>You have no gifts to order.</p>
      <div class="form-input__actions">
        <button v-if="gifts.length > 0" class="button" :disabled="isSaving" @click="saveOrder()">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageMyListOrder',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      gifts: [],
      loaded: false,
      isSaving: false
    }
  },
  async created () {
    this.loaded = false
    const gifts = await api.getGifts()
    if (!gifts.error) {
      this.gifts = gifts.result.map(item => {
        if (item.order === null || item.order === undefined) {
          item.order = -1
        }
        return item
      }).sort((a, b) => a.order - b.order).map((item, idx) => {
        item.order = idx
        return item
      })
    }
    this.loaded = true
  },
  methods: {
    up (idx) {
      if (idx > 0) {
        this.gifts[idx].order = idx - 1
        this.gifts[idx - 1].order = idx
      }
      this.gifts.sort((a, b) => a.order - b.order)
    },
    down (idx) {
      if (idx < this.gifts.length - 1) {
        this.gifts[idx].order = idx + 1
        this.gifts[idx + 1].order = idx
      }
      this.gifts.sort((a, b) => a.order - b.order)
    },
    async saveOrder () {
      if (this.isSaving === false) {
        this.isSaving = true

        const giftRequests = this.gifts.map(gift => {
          return new Promise(async (resolve, reject) => {
            let result = await api.updateGift(gift._id, {
              name: gift.name,
              link: gift.link,
              price: gift.price,
              order: gift.order
            })
            resolve(result)
          })
        })

        const resultArray = await Promise.all(giftRequests)
        const errors = resultArray.map(res => res.error ? res.message : null).filter(i => i)

        if (errors > 0) {
          alert(`Errors occured: ${errors.join(', ')}`)
        } else {
          this.$router.push('/mylist')
        }
        this.isSaving = false
      }
    }
  }
}
</script>
