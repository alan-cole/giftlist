<template>
  <div>
    <top-menu previousPage="/menu" title="My List" />
    <ul>
      <li v-for="(gift, index) in gifts" :key="index">
        <a v-if="gift.link" :href="gift.link" target="_blank">{{ gift.name }}</a>
        <span v-else>{{ gift.name }}</span>
        <span>Price: {{ gift.price }}</span>
        <router-link :to="{ name: 'PageAddGift', params: { gift } }">Edit {{ gift.name }}</router-link>
      </li>
    </ul>
    <router-link class="button" to="/addgift">Add Gift</router-link>
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
      gifts: []
    }
  },
  async created () {
    const gifts = await api.getGifts()
    if (!gifts.error) {
      this.gifts = gifts.result
    }
  }
}
</script>
