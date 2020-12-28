<template>
  <div>
    <top-menu previousPage="/menu" title="My List" />
    <div v-if="loaded" class="container">
      <ul v-if="gifts.length > 0" class="list">
        <li v-for="(gift, index) in gifts" :key="index" class="nav-item">
          <div>
            <a v-if="gift.link" :href="gift.link" target="_blank">{{ gift.name }}</a>
            <span v-else>{{ gift.name }}</span>
            <div v-if="gift.price" class="nav-item__sub-item">
              <span>${{ gift.price }}</span>
            </div>
          </div>
          <router-link class="nav-item__btn nav-item__btn--edit" :to="{ name: 'PageAddGift', params: { gift } }">Edit {{ gift.name }}</router-link>
        </li>
      </ul>
      <div v-else>You haven't added any gifts.</div>
      <router-link class="button" to="/addgift">Add Gift</router-link>
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
      this.gifts = gifts.result
    }
    this.loaded = true
  }
}
</script>
