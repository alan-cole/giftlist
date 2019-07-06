<template>
  <div>
    <top-menu previousPage="/mylist" title="New Gift" />
    <form @submit.prevent="submitForm()">
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
      <input class="button" type="submit" value="Save" />
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
      editPrice: this.gift ? this.gift.price : ''
    }
  },
  methods: {
    async submitForm () {
      const result = await api.addGift({
        name: this.editName,
        link: this.editLink,
        price: this.editPrice
      })
      if (!result.error) {
        this.$router.push('/mylist')
      } else {
        alert(`An error occured: ${result.message}`)
      }
    }
  }
}
</script>
