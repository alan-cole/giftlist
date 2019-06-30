<template>
  <div>
    <top-menu previousPage="/menu" title="New Friend" />
  </div>
</template>

<script>
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageAddFriend',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  }
}
</script>
