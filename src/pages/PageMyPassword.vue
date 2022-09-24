<template>
  <div>
    <top-menu previousPage="/myaccount" title="My Password" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Password (required)</span>
        <input v-model="editPassword" type="password" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>New Password (required)</span>
        <input v-model="editNewPassword" type="password" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Repeat New Password (required)</span>
        <input v-model="editNewPasswordRepeat" type="password" class="form-input__text" />
      </label>
      <div class="form-input__actions">
        <input class="button" type="submit" value="Save" :disabled="isSaving" />
      </div>
    </form>
  </div>
</template>

<script>
import api from '../lib/api.js'
import authenticatedPage from '../mixins/authentication.js'
import TopMenu from '../components/TopMenu.vue'

export default {
  name: 'PageMyPassword',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      editPassword: '',
      editNewPassword: '',
      editNewPasswordRepeat: '',
      isSaving: false
    }
  },
  methods: {
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        if (this.editNewPassword === this.editNewPasswordRepeat) {
          const result = await api.updatePassword(this.editPassword, this.editNewPassword)
          if (!result.error) {
            this.$router.push('/myaccount')
          } else {
            alert(`An error occured: ${result.message}`)
          }
        } else {
          alert(`New password fields don't match.`)
        }
        this.isSaving = false
      }
    }
  }
}
</script>
