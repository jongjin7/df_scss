import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import SubPage from '@/components/SubPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/sub',
      name: 'sub',
      component: SubPage
    }
  ]
})
