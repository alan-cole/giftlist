import Vue from 'vue'
import Router from 'vue-router'
import PageLogin from '../pages/PageLogin'
import PageMenu from '../pages/PageMenu'
import PageMyList from '../pages/PageMyList'
import PageFriendsList from '../pages/PageFriendsList'
import PageFriends from '../pages/PageFriends'
import PageSignup from '../pages/PageSignup'
import PageAddFriend from '../pages/PageAddFriend'
import PageAddGift from '../pages/PageAddGift'
import PageMyAccount from '../pages/PageMyAccount'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PageLogin',
      component: PageLogin
    },
    {
      path: '/menu',
      name: 'PageMenu',
      component: PageMenu
    },
    {
      path: '/mylist',
      name: 'PageMyList',
      component: PageMyList
    },
    {
      path: '/myaccount',
      name: 'PageMyAccount',
      component: PageMyAccount
    },
    {
      path: '/friendslists',
      name: 'PageFriendsList',
      component: PageFriendsList
    },
    {
      path: '/friends',
      name: 'PageFriends',
      component: PageFriends
    },
    {
      path: '/signup',
      name: 'PageSignup',
      component: PageSignup
    },
    {
      path: '/addfriend',
      name: 'PageAddFriend',
      component: PageAddFriend,
      props: true
    },
    {
      path: '/addgift',
      name: 'PageAddGift',
      component: PageAddGift,
      props: true
    }
  ]
})
