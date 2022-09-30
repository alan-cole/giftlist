<template>
  <Layout previous-page="/" title="Sign Up" :form="true" :form-submit="submitForm" :is-authenticated="false">
    <label class="form-input__label">
      <span>Username (required)</span>
      <input v-model="editUsername" type="text" class="form-input__text" required autocorrect="off" autocapitalize="none" />
    </label>
    <label class="form-input__label">
      <span>Password (required)</span>
      <input v-model="editPassword" type="password" class="form-input__text" required />
    </label>
    <label class="form-input__label">
      <span>Name (required)</span>
      <input v-model="editName" type="text" class="form-input__text" required />
    </label>
    <label class="form-input__label">
      <span>Email</span>
      <input v-model="editEmail" type="email" class="form-input__text" />
    </label>
    <label class="form-input__label">
      <span>Signup Code (required)</span>
      <input v-model="editCode" type="text" class="form-input__text" required autocorrect="off" autocapitalize="none" />
    </label>
    <template #actions>
      <input class="button" type="submit" value="Register" :disabled="isSaving" />
    </template>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import Layout from '../components/Layout.vue'

export default {
  name: 'PageSignup',
  components: {
    Layout
  },
  data () {
    return {
      editUsername: '',
      editPassword: '',
      editName: '',
      editEmail: '',
      editCode: '',
      isSaving: false
    }
  },
  methods: {
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        let result = await api.register(this.editUsername, this.editPassword, this.editName, this.editEmail, this.editCode)
        if (!result.error) {
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
