<template>
  <div>
    <top-menu previousPage="/myaccount" title="My Details" />
    <div class="container">
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
        <input class="button" type="submit" value="Save" />
      </form>
    </div>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

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
      editEmail: ''
    }
  },
  created () {
    // TODO - load user details.
  },
  methods: {
    async submitForm () {
      let result = await api.updateUser(this.editUsername, this.editName, this.editEmail)
      if (!result.error) {
        this.$router.push('/myaccount')
      } else {
        alert(`An error occured: ${result.message}`)
      }
    }
  }
}
</script>
