<template>
  <Layout previous-page="/" title="Forgot Password" :form="true" :form-submit="submitForm" :is-authenticated="false">
    <label class="form-input__label">
      <span>Username (required)</span>
      <input v-model="editUsername" type="text" class="form-input__text" required autocorrect="off" autocapitalize="none" />
    </label>
    <template #actions>
      <input class="button" type="submit" value="Get reset email" :disabled="isSaving" />
    </template>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import Layout from '../components/Layout.vue'

export default {
  name: 'PageForgotPassword',
  components: {
    Layout
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
