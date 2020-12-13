<template>
  <div>
    <top-menu previousPage="/menu" title="My Account" />
    <div class="container">
      Coming soon
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
