<template>
  <Layout :loaded="loaded" previous-page="/menu" title="Friends">
    <NavList title="My friends" no-items="You haven't added any friends." :items="friends">
      <template #item="props">
        <NavItem :label="props.item.name">
          <template #after>
            <NavButton
              type="button"
              variation="delete"
              :label="`Delete ${props.item.name}`"
              :disabled="isSaving"
              @click="deleteFriend(props.item)"
            />
          </template>
        </NavItem>
      </template>
    </NavList>
    <div class="form-input__actions">
      <router-link class="button" to="/addfriend">Add Friend</router-link>
    </div>
    <NavList title="Friended by" no-items="You are not friended by anyone." :items="friendedBy">
      <template #item="props">
        <NavItem :label="props.item.name">
          <template #after>
            <NavButton
              v-if="!props.item.isFriend"
              type="button"
              variation="add"
              :label="`Add ${props.item.name}`"
              :disabled="isSaving"
              @click="addFriend(props.item)"
            />
          </template>
        </NavItem>
      </template>
    </NavList>
  </Layout>
</template>

<script>
import api from '../lib/api.js'
import Layout from '../components/Layout.vue'
import NavList from '../components/NavList.vue'
import NavItem from '../components/NavItem.vue'
import NavButton from '../components/NavButton.vue'

export default {
  name: 'PageFriends',
  components: {
    Layout,
    NavList,
    NavItem,
    NavButton
  },
  data () {
    return {
      friends: [],
      friendedBy: [],
      loaded: false,
      isSaving: false
    }
  },
  methods: {
    async deleteFriend (friend) {
      if (this.isSaving === false) {
        this.isSaving = true
        const userInput = confirm(`Are you sure you want to delete ${friend.name}?`)
        if (userInput) {
          const result = await api.deleteFriend(friend._id)
          if (!result.error) {
            this.loadFriends()
          } else {
            alert(`An error occured: ${result.message}`)
          }
        }
        this.isSaving = false
      }
    },
    async loadFriends () {
      this.loaded = false
      // Load my friends
      const friends = await api.getFriends()
      if (!friends.error) {
        this.friends = friends.result
      }

      // Load users who added me as a friend
      const friendedBy = await api.getFriendedUsers()
      if (!friendedBy.error) {
        const friendedUsers = friendedBy.result
        this.friendedBy = friendedUsers.map(user => {
          let isFriend = false
          this.friends.forEach(friend => {
            if (friend._id === user._id) {
              isFriend = true
            }
          })
          return {
            _id: user._id,
            name: user.name,
            username: user.username,
            isFriend: isFriend
          }
        })
      }
      this.loaded = true
    },
    async addFriend (user) {
      if (this.isSaving === false) {
        this.isSaving = true
        const result = await api.addFriend(user.username)
        if (!result.error) {
          this.loadFriends()
        } else {
          alert(`An error occured: ${result.message}`)
        }
        this.isSaving = false
      }
    }
  },
  async created () {
    await this.loadFriends()
  }
}
</script>
