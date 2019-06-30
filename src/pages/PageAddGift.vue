<template>
  <div>
    <top-menu previousPage="/menu" title="New Gift" />
  </div>
</template>

<script>
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageAddGift',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  }
}
</script>
