<template>
  <div>
    <top-menu previousPage="/menu" title="Sessions" />
    <div class="container">
      <ul v-if="list.length > 0" class="list">
        <li v-for="(session, index) in list" :key="index" class="nav-item">
          <button @click="setSession(index)" :class="{
            'nav-item__btn': true,
            'nav-item__btn--left': true,
            'nav-item__btn--checked': session.checked,
            'nav-item__btn--unchecked': !session.checked
          }">Toggle Session</button>
          <span>{{ session.name }}</span>
          <button class="nav-item__btn nav-item__btn--delete" @click="deleteSession(index)">Delete</button>
        </li>
      </ul>
      <div v-else>You haven't any sessions.</div>
      <div class="form-input__actions">
        <router-link class="button" to="/addsession">Add Session</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import sessions from '../lib/sessions'
import authenticatedPage from '../mixins/authentication'
import TopMenu from '../components/Menu'

export default {
  name: 'PageSessions',
  mixins: [authenticatedPage],
  components: {
    TopMenu
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    setSession (index) {
      sessions.setSession(index)
      this.refreshVisibleSessions()
    },
    deleteSession (index) {
      sessions.deleteSession(index)
      this.refreshVisibleSessions()
    },
    refreshVisibleSessions () {
      const token = sessions.getToken()
      const sessionList = sessions.getSessions()
      this.list = sessionList.map(item => ({ name: item.name, checked: (token === item.token), token: item.token }))
    }
  },
  async created () {
    this.refreshVisibleSessions()
  }
}
</script>
