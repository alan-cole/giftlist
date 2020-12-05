<template>
  <div>
    <top-menu previousPage="/friends" title="New Friend" />
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
