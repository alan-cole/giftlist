<template>
  <div>
    <top-menu previousPage="/friends" title="New Friend" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Email (required)</span>
        <input v-model="editEmail" type="text" class="form-input__text" required />
      </label>
      <input class="button" type="submit" value="Save" />
    </form>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageAddFriend',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      editEmail: ''
    }
  },
  methods: {
    async submitForm () {
      let result = null
      result = await api.addFriend(this.editEmail)
      if (!result.error) {
        this.$router.push('/friends')
      } else {
        alert(`An error occured: ${result.message}`)
      }
    }
  }
}
</script>
