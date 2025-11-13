English | [中文](README.md)

# Vue 3 + Vite 5 + JSX Template

A ready-to-use front-end template integrating Vue 3, Vite 5, JSX, UnoCSS, automatic routing and layouts, Pinia, Vue I18n, and Axios request utilities. Perfect for quickly bootstrapping small to medium web projects.

## Stack & Features

- Vue 3 + Composition API with JSX support (`@vitejs/plugin-vue`, `@vitejs/plugin-vue-jsx`)
- Vite 5 dev server and build, with curated plugins
- UnoCSS atomic CSS and icons (`unocss`, `presetWind3`, `presetIcons`)
- File-based routing and layouts (`vite-plugin-pages` + `vite-plugin-vue-layouts`)
- State management (`pinia`)
- Internationalization (`vue-i18n`) with lazy-loaded JSON messages
- HTTP utilities (`axios`): request/response interceptors, de-dup & cancel, cookie/device id, optional payload encryption
- Code style (`@antfu/eslint-config`), pre-commit `lint-staged`

## Requirements

- Node.js: `v20.17.0` recommended (see `.nvmrc`)
- Package manager: `pnpm >= 8`

## Getting Started

```bash
pnpm install
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

Preview production build locally:

```bash
pnpm run preview
```

## Scripts

- `pnpm run dev`: development mode (`--mode dev`)
- `pnpm run build`: production build (`--mode production`)
- `pnpm run preview`: preview the production build locally
- `pnpm run test`: build in dev mode (placeholder, no test framework)
- `pnpm run lint` / `pnpm run lint:fix`: ESLint check / auto-fix
- `pnpm run up`: upgrade dependencies (`taze`)

Postinstall: `simple-git-hooks` installs local git hooks, `pre-commit` runs `lint-staged`.

## Project Structure

```
src/
  assets/            Static assets & icons (Iconify loaders)
  components/        Reusable components (.vue/.jsx)
  hooks/             Composables
  https/             HTTP utilities (axios + interceptors + encryption)
    api/             API examples
    config/          axios setup, interceptors, encryption, cookies/device
  layouts/           Page layouts (work with routing)
  locales/           i18n setup and message bundles
  pages/             Pages (auto-generated routes)
  router/            Router instance (layouts + file routes)
  stores/            Pinia stores
  styles/            Global styles (works with UnoCSS)
  utils/             Common utilities
  App.vue            Root component
  main.js            App entry
```

## Routing & Layouts

- File-based routing by `vite-plugin-pages`: files under `src/pages` become routes
- Layouts by `vite-plugin-vue-layouts`, specify via `<route lang="yaml">`
- Example: `src/pages/[...all].vue` uses `layout: 404` for the 404 layout
- Router is created in `src/router/index.js` with `setupLayouts(generatedRoutes)` and `createWebHistory(BASE_URL)`

## Internationalization

- Setup in `src/locales/index.js`
- Language bundles in `src/locales/modules/*.json` (lazy-loaded)
- Language selection: prefer `localStorage('lang')`, fallback to browser language (e.g. `en` / `zh`)

## Styles & Icons

- UnoCSS configured in `uno.config.js` with shortcuts and rules; `presetWind3`, `presetAttributify`, `presetIcons` enabled
- Global style entry: `src/styles/main.css` (extend as needed)
- Icons loaded from `src/assets/icon` and `src/assets/svg` via Iconify; use class names like `i-carbon-warning`

## State Management

- Using `pinia`, example store: `src/stores/counter.js`

## HTTP Utilities

- Axios instance in `src/https/config/requestConfig.js`, `baseURL` reads from `VITE_HTTP`
- Unified export `src/https/index.js`, which imports both interceptors
- Request interceptor `src/https/config/requestInterceptor.js`:
  - Inject cookie headers via `getCookies`
  - Generate a unique request key; non-whitelisted requests cancel previous ones (`AbortController`)
  - Optional payload encryption (`encryption`, commented by default)
- Response interceptor `src/https/config/responseInterceptor.js`:
  - Handle `data.code` globally, `401/440` clears cookies & triggers logout
  - Always return `response.data`
- API example: `src/https/api/uploadApi.js` (multipart upload)

### Cookies & Device ID

- Cookie manager: `src/https/config/cookieManager.js`
  - Initialize `Device-Id` (based on device fingerprint) and default cookies
  - In development (`MODE=dev`), inject sample `token/Uid` for easier integration
- Device fingerprint: `src/https/config/device.js` uses `@fingerprintjs/fingerprintjs` to get `visitorId`, then `md5`-encode; persisted to `localStorage('DeviceId')` and cookie

### Optional Payload Encryption

- Entry: `src/https/config/encryption.js`
- Algorithm: AES-ECB for payload + RSA public key for the random key + signature by `SHA1 -> MD5`
- Enable by uncommenting `config.data = encryption(config.data)` in the request interceptor and setting `VITE_HTTP_PUBLIC_KEY` in `.env.*`

## Environment & Proxy

- Environment files: `.env.dev` / `.env.test` / `.env.production`
- Key vars:
  - `VITE_HTTP`: API base URL. In development, set to `'/api'` with Vite proxy
  - `VITE_HTTP_PUBLIC_KEY`: RSA public key for encryption (required when encryption is enabled)
- Proxy: configure `server.proxy['/api'].target` in `vite.config.js` and keep `rewrite: path => path.replace(/^\/api/, '')`

## Aliases

- Configured in `vite.config.js`:
  - `@` -> `src`
  - `@api` -> `src/https/api`
  - `@hooks` -> `src/hooks`

## Code Style & Commit

- ESLint based on `@antfu/eslint-config`, with Vue and UnoCSS support
- Commit hooks: `simple-git-hooks` + `lint-staged`; auto-fix on commit: `"*": "eslint --fix"`

## Recommended IDE

- VSCode + Volar (disable Vetur)
- TypeScript Vue Plugin (Volar)

## Notes

- Use Node `v20.17.0` to avoid toolchain issues
- Configure proxy target and `VITE_HTTP` before back-end integration
- Provide `VITE_HTTP_PUBLIC_KEY` in production if encryption is enabled
- In development, default cookies inject sample `token/Uid`; adjust to your back-end protocol

---

More Vite config: https://vitejs.dev/config/
