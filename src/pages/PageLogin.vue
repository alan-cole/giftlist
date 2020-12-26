<template>
  <div class="page-login">
    <h1 class="page-login__heading">Gift List</h1>
    <form @submit.prevent="requestLogin">
      <label class="form-input__label">
        <span>Username</span>
        <input class="form-input__text" v-model="username" type="text" />
      </label>
      <label class="form-input__label">
        <span>Password</span>
        <input class="form-input__text" v-model="password" type="password" />
      </label>
      <input class="button button--wide" type="submit" value="Log in" />
    </form>
    <router-link class="button button--wide" to="/signup">Sign Up</router-link>
  </div>
</template>

<script>
import api from '../lib/api'

export default {
  name: 'PageLogin',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async requestLogin () {
      try {
        const result = await api.login(this.username, this.password)
        if (result.error) {
          alert(result.message)
        } else {
          localStorage.setItem('token', result.result.token)
          // Redirect to menu
          this.$router.push('/menu')
        }
      } catch (err) {
        alert('An error occured.')
      }
    }
  },
  created () {
    // Check if already logged in.
    if (localStorage.getItem('token')) {
      // Redirect to menu
      this.$router.push('/menu')
    }
  }
}
</script>

<style lang="scss">
.page-login {
  margin: auto;
  max-width: 330px;

  &__heading {
    font-family: 'Dancing Script', cursive;
    font-style: normal;
    font-weight: normal;
    font-size: 64px;
    line-height: normal;
    margin-top: 133px;
    margin-bottom: 22px;
    text-align: center;
    color: #000000;
  }
}
</style>
