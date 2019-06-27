<template>
  <div>
    <top-menu previousPage="/menu" title="My List" />
    <router-link class="button" to="/addgift">Add Gift</router-link>
  </div>
</template>

<script>
import TopMenu from '../components/Menu'

export default {
  name: 'PageMyList',
  components: {
    TopMenu
  }
}
</script>
