import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'

const { BASE_URL } = import.meta.env
// 设置路由并注册布局
const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes: setupLayouts(generatedRoutes),
})

export default router
