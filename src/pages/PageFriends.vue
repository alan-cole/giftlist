<template>
  <div>
    <top-menu previousPage="/menu" title="Friends" />
    <router-link class="button" to="/addfriend">Add Friend</router-link>
  </div>
</template>

<script>
import TopMenu from '../components/Menu'

export default {
  name: 'PageFriends',
  components: {
    TopMenu
  }
}
</script>
