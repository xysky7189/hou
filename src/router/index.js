import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      // name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('@/views/account')
        },
        {
          name: 'media',
          path: '/media',
          component: () => import('@/views/media')
        },
        {
          name: 'fans',
          path: '/fans',
          component: () => import('@/views/fans')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = getUser()
  if (to.path !== '/login') {
    if (!userInfo) {
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    if (!userInfo) {
      next()
    } else {
      // next(false)
      // next()
      next({ name: 'home' })
      // window.location.href = '/#/'
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  nprogress.done()
})

export default router
