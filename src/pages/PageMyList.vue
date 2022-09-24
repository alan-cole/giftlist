<template>
  <div :class="{ 'loading': !loaded }">
    <top-menu previousPage="/menu" title="My Gift List" />
    <div v-if="loaded" class="container">
      <NavList :items="gifts" no-items="You haven't added any gifts.">
        <template #item="props">
          <NavItem
            :to="props.item.link"
            :new-window="true"
            :label="props.item.name"
            :sub-item="props.item.price && `$${props.item.price}`"
          >
            <template #after>
              <NavButton
                type="link"
                variation="edit"
                :label="`Edit ${props.item.name}`"
                :to="{ name: 'PageEditGift', params: { giftid: props.item._id } }"
              />
            </template>
          </NavItem>
        </template>
      </NavList>
      <div class="form-input__actions">
        <router-link v-if="gifts.length > 0" class="button button--left" to="/mylistorder">Order</router-link>
        <router-link class="button" to="/addgift">Add Gift</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../lib/api.js'
import authenticatedPage from '../mixins/authentication.js'
import TopMenu from '../components/TopMenu.vue'
import NavList from '../components/NavList.vue'
import NavItem from '../components/NavItem.vue'
import NavButton from '../components/NavButton.vue'

export default {
  name: 'PageMyList',
  mixins: [authenticatedPage],
  components: {
    TopMenu,
    NavList,
    NavItem,
    NavButton
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
