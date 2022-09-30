<template>
  <div class="layout" :class="{ 'loading': !loaded }">
    <top-menu :previous-page="previousPage" :title="title" />
    <template v-if="!form">
      <div v-if="loaded" class="container">
        <slot />
        <div class="form-input__actions">
          <slot name="actions" />
        </div>
      </div>
    </template>
    <template v-else>
      <form v-if="loaded" @submit.prevent="formSubmit()" class="container">
        <slot />
        <div class="form-input__actions">
          <slot name="actions" />
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import TopMenu from './TopMenu.vue'

export default {
  name: 'Layout',
  components: {
    TopMenu
  },
  props: {
    loaded: { type: Boolean, default: true },
    previousPage: String,
    title: String,
    form: { type: Boolean, default: false },
    formSubmit: Function,
    isAuthenticated: { type: Boolean, default: true }
  },
  setup (props) {
    if (props.isAuthenticated) {
      const router = useRouter()
      // Redirect user to home if not logged in.
      if (localStorage.getItem('token') === null) {
        router.push('/')
      }
      return {}
    }
  }
}
</script>
