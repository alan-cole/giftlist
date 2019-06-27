<template>
  <div>
    <top-menu previousPage="/menu" title="New Friend" />
  </div>
</template>

<script>
import TopMenu from '../components/Menu'

export default {
  name: 'PageAddFriend',
  components: {
    TopMenu
  }
}
</script>
