<template>
  <Layout previous-page="/mylist" title="New Gift" :form="true" :form-submit="submitForm">
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
    <template #actions>
      <input v-if="giftid" class="button button--delete button--left" type="button" @click="deleteGift()" value="Delete" :disabled="isSaving" />
      <input class="button" type="submit" value="Save" :disabled="isSaving" />
    </template>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import Layout from '../components/Layout.vue'

export default {
  name: 'PageAddGift',
  components: {
    Layout
  },
  props: {
    giftid: String
  },
  data () {
    return {
      order: -1,
      editName: '',
      editLink: '',
      editPrice: '',
      isSaving: false
    }
  },
  methods: {
    async deleteGift () {
      if (this.isSaving === false) {
        this.isSaving = true
        const userInput = confirm('Are you sure you want to delete?')
        if (userInput) {
          const result = await api.deleteGift(this.giftid)
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
        if (this.giftid) {
          result = await api.updateGift(this.giftid, {
            name: this.editName,
            link: this.editLink,
            price: this.editPrice,
            order: this.order
          })
        } else {
          result = await api.addGift({
            name: this.editName,
            link: this.editLink,
            price: this.editPrice,
            order: -1
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
  },
  async created () {
    if (this.giftid) {
      const result = await api.getGift(this.giftid)
      const gift = result.result[0]
      this.editName = gift.name
      this.editLink = gift.link
      this.editPrice = gift.price
      this.order = gift.order
    }
  },
}
</script>
