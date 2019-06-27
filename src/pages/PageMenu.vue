<template>
  <div>
    <top-menu previousPage="/" title="Menu" />
    <nav>
      <ul>
        <li><router-link class="nav-item nav-item--forward" to="/mylist">My List</router-link></li>
        <li><router-link class="nav-item nav-item--forward" to="/friendslists">Friend's List</router-link></li>
        <li><router-link class="nav-item nav-item--forward" to="/friends">Friends</router-link></li>
        <li><router-link class="nav-item nav-item--forward" to="/">Log Out</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import TopMenu from '../components/Menu'

export default {
  name: 'PageMenu',
  components: {
    TopMenu
  }
}
</script>
