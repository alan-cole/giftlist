<template>
  <div>
    <top-menu previousPage="/friends" title="New Friend" />
    <form @submit.prevent="submitForm()">
      <label v-if="!friend" class="form-input__label">
        <span>Email (required)</span>
        <input v-model="editEmail" type="text" class="form-input__text" required />
      </label>
      <input v-if="!friend" class="button" type="submit" value="Save" />
      <h2 v-if="friend">{{ friend.name }}</h2>
      <input v-if="friend" class="button button--delete" type="button" @click="deleteFriend()" value="Delete" />
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
  props: {
    friend: Object
  },
  data () {
    return {
      editEmail: ''
    }
  },
  methods: {
    async deleteFriend () {
      const userInput = confirm('Are you sure you want to delete?')
      if (userInput) {
        const result = await api.deleteFriend(this.friend._id)
        if (!result.error) {
          this.$router.push('/mylist')
        } else {
          alert(`An error occured: ${result.message}`)
        }
      }
    },
    async submitForm () {
      let result = null
      if (this.friend) {
        // Do nothing
      } else {
        result = await api.addFriend(this.editEmail)
      }
      if (!result.error) {
        this.$router.push('/friends')
      } else {
        alert(`An error occured: ${result.message}`)
      }
    }
  }
}
</script>
