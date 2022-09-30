<template>
  <Layout previous-page="/menu" title="My Account">
    <NavList :items="menu">
      <template #item="props">
        <NavItem v-bind="props.item" decal="arrow" />
      </template>
    </NavList>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import NavList from '../components/NavList.vue'
import NavItem from '../components/NavItem.vue'

export default {
  name: 'PageMyAccount',
  components: {
    Layout,
    NavList,
    NavItem
  },
  data () {
    return {
      menu: [
        { type: 'link', label: 'Change Details', to: '/changedetails' },
        { type: 'link', label: 'Change Password', to: '/changepassword' },
        { type: 'link', label: 'Delete Account', to: '/deleteaccount' }
      ]
    }
  }
}
</script>
