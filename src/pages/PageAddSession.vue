<template>
  <div>
    <top-menu previousPage="/sessions" title="New Session" />
    <form @submit.prevent="requestLogin()" class="container">
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
  </div>
</template>

<script>
import api from '../lib/api.js'
import sessions from '../lib/sessions.js'
import authenticatedPage from '../mixins/authentication.js'
import TopMenu from '../components/TopMenu.vue'

export default {
  name: 'PageAddSession',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
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
            sessions.addSession(result.result.name, result.result.token)
            // Redirect to sessions
            this.$router.push('/sessions')
          }
        } catch (err) {
          alert('An error occured.')
        }
        this.isSaving = false
      }
    }
  }
}
</script>
