import Vue from 'vue'
import Router from 'vue-router'
import PageLogin from '../pages/PageLogin.vue'
import PageMenu from '../pages/PageMenu.vue'
import PageMyList from '../pages/PageMyList.vue'
import PageMyListOrder from '../pages/PageMyListOrder.vue'
import PageFriendsList from '../pages/PageFriendsList.vue'
import PageFriends from '../pages/PageFriends.vue'
import PageSignup from '../pages/PageSignup.vue'
import PageForgotPassword from '../pages/PageForgotPassword.vue'
import PageResetPassword from '../pages/PageResetPassword.vue'
import PageAddFriend from '../pages/PageAddFriend.vue'
import PageAddGift from '../pages/PageAddGift.vue'
import PageMyAccount from '../pages/PageMyAccount.vue'
import PageMyDetails from '../pages/PageMyDetails.vue'
import PageMyPassword from '../pages/PageMyPassword.vue'
import PageSessions from '../pages/PageSessions.vue'
import PageAddSession from '../pages/PageAddSession.vue'
import PageUnregister from '../pages/PageUnregister.vue'

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
      path: '/signup',
      name: 'PageSignup',
      component: PageSignup
    },
    {
      path: '/forgotpassword',
      name: 'PageForgotPassword',
      component: PageForgotPassword
    },
    {
      path: '/resetpassword',
      name: 'PageResetPassword',
      component: PageResetPassword
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
      path: '/mylistorder',
      name: 'PageMyListOrder',
      component: PageMyListOrder
    },
    {
      path: '/myaccount',
      name: 'PageMyAccount',
      component: PageMyAccount
    },
    {
      path: '/changedetails',
      name: 'PageMyDetails',
      component: PageMyDetails
    },
    {
      path: '/changepassword',
      name: 'PageMyPassword',
      component: PageMyPassword
    },
    {
      path: '/deleteaccount',
      name: 'PageUnregister',
      component: PageUnregister
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
    },
    {
      path: '/sessions',
      name: 'PageSessions',
      component: PageSessions
    },
    {
      path: '/addsession',
      name: 'PageAddSession',
      component: PageAddSession,
      props: true
    }
  ]
})
