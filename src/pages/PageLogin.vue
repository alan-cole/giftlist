<template>
  <div class="page-login">
    <h1 class="page-login__heading">Gift List</h1>
    <form @submit.prevent="requestLogin">
      <label class="form-input__label">
        <span>Username</span>
        <input class="form-input__text" v-model="username" type="text" autocorrect="off" autocapitalize="none" />
      </label>
      <label class="form-input__label">
        <span>Password</span>
        <input class="form-input__text" v-model="password" type="password" />
      </label>
      <input class="button button--wide" type="submit" value="Log in" :disabled="isSaving" />
    </form>
    <div class="page-login__signup-message">Don't have an account? <router-link class="link" to="/signup">Sign Up</router-link></div>
  </div>
</template>

<script>
import api from '../lib/api'

export default {
  name: 'PageLogin',
  data () {
    return {
      username: '',
      password: '',
      isSaving: false
    }
  },
  methods: {
    async requestLogin () {
      if (this.isSaving === false) {
        this.isSaving = true
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
        this.isSaving = false
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
    font-size: 0%;
    width: 198px;
    height: 65px;
    background-image: url('../assets/images/logo.svg');
    margin: 133px auto 22px;
  }

  &__signup-message {
    text-align: center;
  }
}
</style>
