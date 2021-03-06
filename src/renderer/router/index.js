import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: require('@/components/Layout/Layout').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
