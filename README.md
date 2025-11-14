[English](README.en.md) | 中文

---

# Vue 3 + Vite 5 + JSX 模板

一个开箱即用的前端模板，集成 Vue 3、Vite 5、JSX、UnoCSS、自动路由与布局、Pinia、Vue I18n、Axios 请求封装等常用能力，适合快速搭建中小型 Web 项目。

## 技术栈与特性

- Vue 3 + Composition API 与 JSX 支持（`@vitejs/plugin-vue`、`@vitejs/plugin-vue-jsx`）
- Vite 5 构建与开发服务器，按需插件集成
- UnoCSS 原子化样式与图标（`unocss`、`presetWind3`、`presetIcons`）
- 自动路由与布局（`vite-plugin-pages` + `vite-plugin-vue-layouts`）
- 状态管理（`pinia`）
- 国际化（`vue-i18n`，自动按需加载 JSON 语言包）
- 网络请求封装（`axios`），请求/响应拦截、去重与取消、Cookie 管理与设备指纹、可选表单加密
- 代码规范（`@antfu/eslint-config`），提交前自动 `lint-staged`

## 环境要求

- Node.js：最低 `>= 18.0.0`，推荐 `>= 18.18.0`（或 `>= 20.9.0`）
- 包管理器：`pnpm >= 8`

## 快速开始

```bash
pnpm install
pnpm run dev
```

构建生产包：

```bash
pnpm run build
```

本地预览已构建产物：

```bash
pnpm run preview
```

## 常用命令

- `pnpm run dev`：开发模式（`--mode dev`）
- `pnpm run build`：生产构建（`--mode production`）
- `pnpm run preview`：本地预览生产构建
- `pnpm run test`：开发模式构建（模板占位，无测试框架）
- `pnpm run lint` / `pnpm run lint:fix`：ESLint 检查 / 自动修复
- `pnpm run up`：依赖升级（`taze`）

安装后脚本：`simple-git-hooks` 自动安装本地 Git 钩子，`pre-commit` 执行 `lint-staged`。

## 目录结构

```
src/
  assets/            静态资源与图标（uno 图标加载器）
  components/        通用组件（支持 .vue/.jsx）
  hooks/             组合式函数
  https/             请求封装（axios + 拦截器 + 加密）
    api/             API 示例
    config/          axios 配置、拦截器、加密、Cookie/设备指纹
  layouts/           页面布局（与路由联动）
  locales/           i18n 语言包与初始化
  pages/             页面（自动生成路由）
  router/            路由实例（集成自动路由与布局）
  stores/            Pinia 仓库
  styles/            全局样式入口（与 UnoCSS 搭配）
  utils/             通用工具
  App.vue            根组件
  main.js            应用入口
```

## 路由与布局

- 基于 `vite-plugin-pages` 的文件路由：`src/pages` 下的文件自动成为路由
- 使用 `vite-plugin-vue-layouts` 结合 `<route lang="yaml">` 指定布局
- 示例：`src/pages/[...all].vue` 指定 `layout: 404` 进入 404 布局
- 路由创建于 `src/router/index.js`，使用 `setupLayouts(generatedRoutes)` 与 `createWebHistory(BASE_URL)`

## 国际化

- 初始化位置：`src/locales/index.js`
- 语言包：`src/locales/modules/*.json`（按需动态加载）
- 自动选择语言：优先 `localStorage('lang')`，否则取浏览器语言（如 `en` / `zh`）

## 样式与图标

- UnoCSS：在 `uno.config.js` 定义快捷类与规则，启用 `presetWind3`、`presetAttributify`、`presetIcons` 等
- 全局样式入口：`src/styles/main.css`（可按需添加）
- 图标：`src/assets/icon`、`src/assets/svg` 通过 Iconify 加载；页面中可使用如 `i-carbon-warning` 等类名

## 状态管理

- 使用 `pinia`，示例仓库：`src/stores/counter.js`

## 网络请求封装

- `axios` 实例：`src/https/config/requestConfig.js`，`baseURL` 取自环境变量 `VITE_HTTP`
- 统一导出：`src/https/index.js`，引入请求/响应拦截器
- 请求拦截：在 `src/https/config/requestInterceptor.js` 中
  - 注入 Cookie 头（`getCookies`）
  - 生成请求唯一键并缓存，非白名单请求会在重复发送前取消上一个（`AbortController`）
  - 可选表单加密（`encryption`，默认注释，可按需开启）
- 响应拦截：在 `src/https/config/responseInterceptor.js` 中
  - 统一处理 `data.code`，401/440 会清空 Cookie 并触发登出
  - 始终返回 `response.data`
- API 示例：`src/https/api/uploadApi.js`（`multipart/form-data` 上传）

### Cookie 与设备指纹

- Cookie 管理：`src/https/config/cookieManager.js`
  - 初始化时写入 `Device-Id`（基于设备指纹）与默认 Cookie
  - 开发模式（`MODE=dev`）会注入示例 `token/Uid` 便于联调
- 设备指纹：`src/https/config/device.js` 使用 `@fingerprintjs/fingerprintjs` 生成 `visitorId`，经 `md5` 编码后持久化为 `localStorage('DeviceId')` 与 Cookie

### 表单加密（可选）

- 入口：`src/https/config/encryption.js`
- 算法：AES-ECB 加密表单 + RSA 公钥加密随机密钥 + `SHA1 -> MD5` 生成签名
- 开启方式：在请求拦截器中取消注释 `config.data = encryption(config.data)` 并在 `.env.*` 设置 `VITE_HTTP_PUBLIC_KEY`

## 环境变量与代理

- 环境文件：`.env.dev` / `.env.test` / `.env.production`
- 关键变量：
  - `VITE_HTTP`：接口基础地址。开发环境可设为 `'/api'` 并配合 Vite 代理
  - `VITE_HTTP_PUBLIC_KEY`：表单加密 RSA 公钥（开启加密时必填）
- 代理配置：`vite.config.js` 的 `server.proxy['/api'].target` 请按后端地址填写，并保持 `rewrite: path => path.replace(/^\/api/, '')`

## 模块别名

- 在 `vite.config.js` 中配置：
  - `@` -> `src`
  - `@api` -> `src/https/api`
  - `@hooks` -> `src/hooks`

## 代码规范与提交

- ESLint：基于 `@antfu/eslint-config`，内置对 Vue 与 UnoCSS 的支持
- 提交钩子：`simple-git-hooks` + `lint-staged`，提交时自动修复：`"*": "eslint --fix"`

## 推荐开发插件

- VSCode + Volar（关闭 Vetur）
- TypeScript Vue Plugin（Volar）

## 注意事项

- 使用 Node `>= 18.18.0`（或 `>= 20.9.0`）以避免工具链不兼容
- 开发联调前务必配置代理目标与接口 `VITE_HTTP`
- 若开启加密，请在生产环境正确填写 `VITE_HTTP_PUBLIC_KEY`
- 默认 Cookie 在开发环境会写入演示 `token/Uid`，请根据实际后端协议调整

---

更多 Vite 配置参考：https://vitejs.dev/config/
