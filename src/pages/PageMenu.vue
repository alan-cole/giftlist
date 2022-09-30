<template>
  <Layout title="Menu">
    <nav>
      <NavList :items="menu">
        <template #item="props">
          <NavItem v-bind="props.item" decal="arrow" />
        </template>
      </NavList>
    </nav>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import sessions from '../lib/sessions.js'
import Layout from '../components/Layout.vue'
import NavList from '../components/NavList.vue'
import NavItem from '../components/NavItem.vue'

export default {
  name: 'PageMenu',
  components: {
    Layout,
    NavList,
    NavItem
  },
  data () {
    return {
      menu: [
        { type: 'link', label: 'My Gift List', to: '/mylist' },
        { type: 'link', label: 'Friend\'s Gift List', to: '/friendslists' },
        { type: 'link', label: 'Friends', to: '/friends' },
        { type: 'link', label: 'My Account', to: '/myaccount' },
        { type: 'link', label: 'Sessions', to: '/sessions' },
        { type: 'button', label: 'Log Out', click: this.logOut }
      ]
    }
  },
  methods: {
    logOut () {
      api.logout()
      sessions.deleteAll()
      this.$router.push('/')
    }
  }
}
</script>
