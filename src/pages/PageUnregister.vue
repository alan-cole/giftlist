<template>
  <div>
    <top-menu previousPage="/myaccount" title="Delete Account" />
    <div class="container">
      <p>Deleting your account will remove all your data from Gift List.</p>
      <p>If you want to use Gift List again, you will need to create a new account.</p>
      <div class="form-input__actions">
        <input class="button button--delete button--left" type="button" @click="deleteAccount()" value="Delete" :disabled="isSaving" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '../lib/api'
import sessions from '../lib/sessions'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/TopMenu'

export default {
  name: 'PageUnregister',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      isSaving: false
    }
  },
  methods: {
    async deleteAccount () {
      if (this.isSaving === false) {
        this.isSaving = true
        if (confirm('Are you sure you want to delete your account?')) {
          const result = await api.unregister()
          if (!result.error) {
            api.logout()
            sessions.deleteAll()
            this.$router.push('/')
          } else {
            alert(`An error occured: ${result.message}`)
          }
        }
        this.isSaving = false
      }
    }
  }
}
</script>
