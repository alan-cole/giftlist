<template>
  <div>
    <top-menu previousPage="/myaccount" title="My Details" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Username (required)</span>
        <input v-model="editUsername" type="text" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Name (required)</span>
        <input v-model="editName" type="text" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Email</span>
        <input v-model="editEmail" type="email" class="form-input__text" />
      </label>
      <div class="form-input__actions">
        <input class="button" type="submit" value="Save" :disabled="isSaving" />
      </div>
    </form>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/TopMenu'

export default {
  name: 'PageMyAccount',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      editUsername: '',
      editName: '',
      editEmail: '',
      isSaving: false
    }
  },
  async created () {
    const result = await api.getUser()
    const user = result.result[0]
    this.editUsername = user.username
    this.editName = user.name
    this.editEmail = user.email
  },
  methods: {
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        const result = await api.updateUser(this.editUsername, this.editName, this.editEmail)
        if (!result.error) {
          this.$router.push('/myaccount')
        } else {
          alert(`An error occured: ${result.message}`)
        }
        this.isSaving = false
      }
    }
  }
}
</script>
