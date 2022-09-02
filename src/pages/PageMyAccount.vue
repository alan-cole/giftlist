<template>
  <div>
    <top-menu previousPage="/menu" title="My Account" />
    <div class="container">
      <ul class="list">
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/changedetails">
          <span class="nav-item__label">Change Details</span>
        </router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/changepassword">
          <span class="nav-item__label">Change Password</span>
        </router-link></li>
        <li><router-link class="nav-item nav-item--clickable nav-item--forward" to="/deleteaccount">
          <span class="nav-item__label">Delete Account</span>
        </router-link></li>
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
