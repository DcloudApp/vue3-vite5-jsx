import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/App.vue'
import { i18n } from '@/locales/index'
import router from '@/router'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'virtual:uno.css'

const app = createApp(App)

app.use(i18n)

app.use(createPinia())
app.use(router)

app.mount('#app')
