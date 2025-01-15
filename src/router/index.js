import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'

const { BASE_URL, VITE_APP_TITLE } = import.meta.env

const routes = generatedRoutes.map(route => route?.meta?.layout !== false ? setupLayouts([route])[0] : route)

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
})

// 创建一个函数，用来动态更新 meta 标签
function updateMetaTag(name, content) {
  let metaTag = document.querySelector(`meta[name="${name}"]`)
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.name = name
    document.head.appendChild(metaTag)
  }
  metaTag.content = content
}

router.beforeEach((to, _, next) => {
  document.title = to.meta.title || VITE_APP_TITLE
  if (to.meta.metaDescription)
    updateMetaTag('description', to.meta.metaDescription)

  next()
})

export default router
