<template>
  <div :class="{ 'loading': !loaded }">
    <top-menu previousPage="/menu" title="My Gift List" />
    <div v-if="loaded" class="container">
      <ul v-if="gifts.length > 0" class="list">
        <li v-for="(gift, index) in gifts" :key="index" class="nav-item">
          <div>
            <a v-if="gift.link" :href="gift.link" target="_blank" class="nav-item__label">{{ gift.name }}</a>
            <span v-else class="nav-item__label">{{ gift.name }}</span>
            <div v-if="gift.price" class="nav-item__sub-item">
              <span>${{ gift.price }}</span>
            </div>
          </div>
          <router-link class="nav-item__btn nav-item__btn--edit" :to="{ name: 'PageAddGift', params: { gift } }">Edit {{ gift.name }}</router-link>
        </li>
      </ul>
      <p v-else>You haven't added any gifts.</p>
      <div class="form-input__actions">
        <router-link v-if="gifts.length > 0" class="button button--left" to="/mylistorder">Order</router-link>
        <router-link class="button" to="/addgift">Add Gift</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageMyList',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      gifts: [],
      loaded: false
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
      }).sort((a, b) => a.order - b.order)
    }
    this.loaded = true
  }
}
</script>
