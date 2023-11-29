import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import removeConsole from 'vite-plugin-remove-console'

const timesTamp = new Date().getTime()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: false,
    }),
    Components({
      dirs: ['src/components'],
      dts: false,
      extensions: ['vue', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.jsx$/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    }),
    visualizer({
      open: true, // 注意这里要设置为true，否则无效
      filename: 'stats.html', // 分析图生成的文件名
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
    }),
    removeConsole(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // chunkSizeWarningLimit: 1500,大文件报警阈值设置,不建议使用
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: `static/js/[name]-[hash]${timesTamp}.js`,
        entryFileNames: `static/js/[name]-[hash]${timesTamp}.js`,
        assetFileNames: `static/[ext]/[name]-[hash]${timesTamp}.[ext]`,
        manualChunks(id) {
          // 静态资源分拆打包
          if (id.includes('node_modules'))
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    // port: 8087,
    https: false,
    proxy: {
      '/api': {
        // 匹配请求路径，
        target: '', // 代理的目标地址
        // 开发模式，默认的127.0.0.1,开启后代理服务会把origin修改为目标地址
        changeOrigin: true,
        // secure: true, // 是否https接口
        // ws: true, // 是否代理websockets
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
