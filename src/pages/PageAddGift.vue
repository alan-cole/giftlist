<template>
  <div>
    <top-menu previousPage="/mylist" title="New Gift" />
    <form @submit.prevent="submitForm()" class="container">
      <label class="form-input__label">
        <span>Gift Name (required)</span>
        <input v-model="editName" type="text" class="form-input__text" required />
      </label>
      <label class="form-input__label">
        <span>Link</span>
        <input v-model="editLink" type="text" class="form-input__text" />
      </label>
      <label class="form-input__label">
        <span>Price</span>
        <input v-model="editPrice" type="text" class="form-input__text" />
      </label>
      <input v-if="gift" class="button button--delete" type="button" @click="deleteGift()" value="Delete" :disabled="isSaving" />
      <input class="button" type="submit" value="Save" :disabled="isSaving" />
    </form>
  </div>
</template>

<script>
import api from '../lib/api'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageAddGift',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  props: {
    gift: Object
  },
  data () {
    return {
      editName: this.gift ? this.gift.name : '',
      editLink: this.gift ? this.gift.link : '',
      editPrice: this.gift ? this.gift.price : '',
      isSaving: false
    }
  },
  methods: {
    async deleteGift () {
      if (this.isSaving === false) {
        this.isSaving = true
        const userInput = confirm('Are you sure you want to delete?')
        if (userInput) {
          const result = await api.deleteGift(this.gift._id)
          if (!result.error) {
            this.$router.push('/mylist')
          } else {
            alert(`An error occured: ${result.message}`)
          }
        }
        this.isSaving = false
      }
    },
    async submitForm () {
      if (this.isSaving === false) {
        this.isSaving = true
        let result = null
        if (this.gift) {
          result = await api.updateGift(this.gift._id, {
            name: this.editName,
            link: this.editLink,
            price: this.editPrice
          })
        } else {
          result = await api.addGift({
            name: this.editName,
            link: this.editLink,
            price: this.editPrice
          })
        }
        if (!result.error) {
          this.$router.push('/mylist')
        } else {
          alert(`An error occured: ${result.message}`)
        }
        this.isSaving = false
      }
    }
  }
}
</script>
