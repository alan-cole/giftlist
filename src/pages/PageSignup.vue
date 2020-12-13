<template>
  <div>
    <top-menu previousPage="/" title="Sign Up" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Email (required)</span>
        <input v-model="editEmail" type="text" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Password (required)</span>
        <input v-model="editPassword" type="text" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Name (required)</span>
        <input v-model="editName" type="text" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Signup Code (required)</span>
        <input v-model="editCode" type="text" class="form-input__text" required />
      </label>
      <input class="button" type="submit" value="Register" />
    </form>
  </div>
</template>

<script>
import api from '../lib/api'
import TopMenu from '../components/Menu'

export default {
  name: 'PageSignup',
  components: {
    TopMenu
  },
  data () {
    return {
      editEmail: '',
      editPassword: '',
      editName: '',
      editCode: ''
    }
  },
  methods: {
    async submitForm () {
      let result = null
      result = await api.register(this.editEmail, this.editPassword, this.editName, this.editCode)
      if (!result.error) {
        this.$router.push('/')
      } else {
        alert(`An error occured: ${result.message}`)
      }
    }
  }
}
</script>
