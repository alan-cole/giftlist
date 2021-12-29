import Vue from 'vue'
import Router from 'vue-router'
import PageLogin from '../pages/PageLogin'
import PageMenu from '../pages/PageMenu'
import PageMyList from '../pages/PageMyList'
import PageFriendsList from '../pages/PageFriendsList'
import PageFriends from '../pages/PageFriends'
import PageSignup from '../pages/PageSignup'
import PageForgotPassword from '../pages/PageForgotPassword'
import PageResetPassword from '../pages/PageResetPassword'
import PageAddFriend from '../pages/PageAddFriend'
import PageAddGift from '../pages/PageAddGift'
import PageMyAccount from '../pages/PageMyAccount'
import PageMyDetails from '../pages/PageMyDetails'
import PageMyPassword from '../pages/PageMyPassword'
import PageUnregister from '../pages/PageUnregister'

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
    }
  ]
})
