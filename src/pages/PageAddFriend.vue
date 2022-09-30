<template>
  <Layout previous-page="/friends" title="New Friend" :form="true" :form-submit="submitForm">
    <label class="form-input__label">
      <span>Friend's Username (required)</span>
      <input v-model="editFriendUsername" type="text" class="form-input__text" required autocorrect="off" autocapitalize="none" />
    </label>
    <template #actions>
      <input class="button" type="submit" value="Save" :disabled="isSaving" />
    </template>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import Layout from '../components/Layout.vue'

export default {
  name: 'PageAddFriend',
  components: {
    Layout
  },
  data () {
    return {
      editFriendUsername: '',
      isSaving: false
    }
  },
  methods: {
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        let result = null
        result = await api.addFriend(this.editFriendUsername)
        if (!result.error) {
          this.$router.push('/friends')
        } else {
          alert(`An error occured: ${result.message}`)
        }
        this.isSaving = false
      }
    }
  }
}
</script>
