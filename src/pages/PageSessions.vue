<template>
  <Layout previous-page="/menu" title="Sessions">
    <NavList no-items="You haven't any sessions." :items="list">
      <template #item="props">
        <NavItem :label="props.item.name">
          <template #before>
            <CheckButton
              :checked="props.item.checked"
              @click="setSession(props.index)"
              label="Toggle Session"
            />
          </template>
          <template #after>
            <NavButton
              type="button"
              variation="delete"
              label="Delete"
              @click="deleteSession(props.index)"
            />
          </template>
        </NavItem>
      </template>
    </NavList>
    <template #actions>
      <router-link class="button" to="/addsession">Add Session</router-link>
    </template>
  </Layout>
</template>

<script>
import sessions from '../lib/sessions.js'
import Layout from '../components/Layout.vue'
import NavList from '../components/NavList.vue'
import NavItem from '../components/NavItem.vue'
import NavButton from '../components/NavButton.vue'
import CheckButton from '../components/CheckButton.vue'

export default {
  name: 'PageSessions',
  components: {
    Layout,
    NavList,
    NavItem,
    NavButton,
    CheckButton
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
