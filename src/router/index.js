import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.jsx'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/AboutView.jsx'),
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})
router.beforeEach(async (to, from, next) => {
  if (localStorage.getItem('appVersion') !== import.meta.env.VITE_APP_VERSION) {
    localStorage.clear() // 清除所有本地存储
    localStorage.setItem('appVersion', import.meta.env.VITE_APP_VERSION) // 更新版本号
  }
  next()
})

export default router
