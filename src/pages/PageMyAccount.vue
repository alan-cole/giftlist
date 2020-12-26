<template>
  <div>
    <top-menu previousPage="/menu" title="My Account" />
    <div class="container">
      <ul class="list">
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/changedetails">Change Details</router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/changepassword">Change Password</router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/deleteaccount">Delete Account</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
// import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageMyAccount',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  }
}
</script>
