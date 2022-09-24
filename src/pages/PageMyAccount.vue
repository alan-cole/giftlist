<template>
  <div>
    <top-menu previousPage="/menu" title="My Account" />
    <div class="container">
      <NavList :items="menu">
        <template slot="item" slot-scope="props">
          <NavItem v-bind="props.item" decal="arrow" />
        </template>
      </NavList>
    </div>
  </div>
</template>

<script>
import authenticatedPage from '../mixins/authentication.js'
import TopMenu from '../components/TopMenu.vue'
import NavList from '../components/NavList.vue'
import NavItem from '../components/NavItem.vue'

export default {
  name: 'PageMyAccount',
  mixins: [authenticatedPage],
  components: {
    TopMenu,
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
