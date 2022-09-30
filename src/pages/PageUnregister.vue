<template>
  <Layout previous-page="/myaccount" title="Delete Account">
    <p>Deleting your account will remove all your data from Gift List.</p>
    <p>If you want to use Gift List again, you will need to create a new account.</p>
    <template #actions>
      <input class="button button--delete button--left" type="button" @click="deleteAccount()" value="Delete" :disabled="isSaving" />
    </template>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import sessions from '../lib/sessions.js'
import Layout from '../components/Layout.vue'

export default {
  name: 'PageUnregister',
  components: {
    Layout
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
