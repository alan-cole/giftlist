<template>
  <div>
    <top-menu previousPage="/menu" title="Friend's List" />
  </div>
</template>

<script>
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageFriendsList',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  }
}
</script>
