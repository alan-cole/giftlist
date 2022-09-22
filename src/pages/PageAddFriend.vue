<template>
  <div>
    <top-menu previousPage="/friends" title="New Friend" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Friend's Username (required)</span>
        <input v-model="editFriendUsername" type="text" class="form-input__text" required autocorrect="off" autocapitalize="none" />
      </label>
      <input class="button" type="submit" value="Save" :disabled="isSaving" />
    </form>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/TopMenu'

export default {
  name: 'PageAddFriend',
  mixins: [authenticatedPage],
  components: {
    TopMenu
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
