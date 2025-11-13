import { fileURLToPath, URL } from 'node:url'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

const timesTamp = new Date().getTime()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    Pages({
      dirs: 'src/pages',
      exclude: ['**/components/*.vue'],
    }),
    Layouts(),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'vue-i18n', 'pinia'],
      dts: false,
    }),
    Components({
      dirs: ['src/components'],
      dts: false,
      extensions: ['vue', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.jsx$/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    }),
    VueI18nPlugin({ /* options */ }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/https/api', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
    },
  },
  build: {
    // chunkSizeWarningLimit: 1500,大文件报警阈值设置,不建议使用
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: `js/[hash]${timesTamp}.js`,
        entryFileNames: `js/[hash]${timesTamp}.js`,
        assetFileNames: `[ext]/[hash]${timesTamp}.[ext]`,
        manualChunks(id) {
          // 静态资源分拆打包
          if (id.includes('node_modules'))
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    host: '0.0.0.0',
    port: 8087,
    https: false,
    proxy: {
      '/api': {
        // 匹配请求路径，
        target: '', // 代理的目标地址
        // 开发模式，默认的127.0.0.1,开启后代理服务会把origin修改为目标地址
        changeOrigin: true,
        // secure: true, // 是否https接口
        // ws: true, // 是否代理websocket
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
