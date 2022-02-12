<template>
  <div>
    <top-menu title="Menu" />
    <nav class="container">
      <ul class="list">
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/mylist">My Gift List</router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/friendslists">Friend's Gift List</router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/friends">Friends</router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/myaccount">My Account</router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/sessions">Sessions</router-link></li>
        <li><button class="nav-item nav-item--clickable nav-item--forward" @click="logOut">Log Out</button></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import api from '../lib/api'
import sessions from '../lib/sessions'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageMenu',
  mixins: [authenticatedPage],
  components: {
    TopMenu
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
