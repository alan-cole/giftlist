<template>
  <div>
    <top-menu previousPage="/menu" title="Friends" />
    <router-link class="button" to="/addfriend">Add Friend</router-link>
  </div>
</template>

<script>
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageFriends',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  }
}
</script>
