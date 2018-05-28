import Vue from 'vue'
import Router from 'vue-router'
import movie from '@/components/movie'
import vuefire from 'vuefire'
Vue.use(vuefire)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'movie',
      component: movie
    }
  ]
})
