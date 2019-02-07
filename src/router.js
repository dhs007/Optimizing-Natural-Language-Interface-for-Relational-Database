import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'

import inner from './components/inner/index'
import Home from './components/inner/home/index.vue'


import Outer from './components/outer'
import Login from './components/outer/auth/login.vue'
import Signup from './components/outer/auth/signup.vue'
import EmailVerify from './components/outer/auth/emailverify'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
    {
      path: '/',
      redirect: '/auth/login'
    },
    {
      path: '/app',
      redirect: '/app/home'
    },
    {
      path: '/',
      name: 'outer',
      component: Outer,
      children: [
        {path: '/auth',redirect: '/auth/login'},
        {path: '/auth/login', component: Login},
        {path: '/auth/email/verify', component: EmailVerify},
        {path: '/signup', component: Signup}
      ]
    },
    {
      path: '/app',
      name: 'inner',
      component: inner,
      children: [
        {path: '/app/home', component: Home, name: 'Home'}
      ]
    }
  ]
})
