<template>
  <div>
    <top-menu title="Menu" />
    <nav class="container">
      <ul class="list">
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/mylist"><span class="nav-item__label">My Gift List</span></router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/friendslists">
          <span class="nav-item__label">Friend's Gift List</span>
        </router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/friends">
          <span class="nav-item__label">Friends</span>
        </router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/myaccount">
          <span class="nav-item__label">My Account</span>
        </router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/sessions">
          <span class="nav-item__label">Sessions</span>
        </router-link></li>
        <li><button class="nav-item nav-item--clickable nav-item--forward" @click="logOut">
          <span class="nav-item__label">Log Out</span>
        </button></li>
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
