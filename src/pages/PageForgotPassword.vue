<template>
  <div>
    <top-menu previousPage="/" title="Forgot Password" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Username (required)</span>
        <input v-model="editUsername" type="text" class="form-input__text" required autocorrect="off" autocapitalize="none" />
      </label>
      <input class="button" type="submit" value="Get reset email" :disabled="isSaving" />
    </form>
  </div>
</template>

<script>
import api from '../lib/api'
import TopMenu from '../components/Menu'

export default {
  name: 'PageForgotPassword',
  components: {
    TopMenu
  },
  data () {
    return {
      editUsername: '',
      isSaving: false
    }
  },
  methods: {
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        let result = await api.forgotPassword(this.editUsername)
        if (!result.error) {
          alert(`An email was sent to you if your account had set an email address.`)
          this.$router.push('/')
        } else {
          alert(`An error occured: ${result.message}`)
        }
        this.isSaving = false
      }
    }
  }
}
</script>
