import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
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
