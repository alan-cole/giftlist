<template>
  <div>
    <top-menu previousPage="/" title="Reset Password" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>New Password (required)</span>
        <input v-model="editPassword" type="password" class="form-input__text" required />
      </label>
      <div class="form-input__actions">
        <input class="button" type="submit" value="Reset password" :disabled="isSaving" />
      </div>
    </form>
  </div>
</template>

<script>
import api from '../lib/api.js'
import TopMenu from '../components/TopMenu.vue'

export default {
  name: 'PageResetPassword',
  components: {
    TopMenu
  },
  data () {
    return {
      editPassword: '',
      code: '',
      isSaving: false
    }
  },
  methods: {
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        if (this.code && this.code.length > 0) {
          let result = await api.resetPassword(this.code, this.editPassword)
          if (!result.error) {
            alert(`Your password was successfully reset.`)
            this.$router.push('/')
          } else {
            alert(`An error occured: ${result.message}`)
          }
        }
        this.isSaving = false
      }
    }
  },
  mounted () {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
  }
}
</script>
