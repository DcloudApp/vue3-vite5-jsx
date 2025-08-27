// cookieManager.js
import Cookies from 'js-cookie'
import { getDeviceId } from './device'

let cachedCookies = null
let cachePromise = null

// 静态默认值（不包含需要异步获取的 Device-Id）
const defaultCookies = {
  'Version-Code': 1,
  'Device-Type': 'web',
  'token': '40f693e791f56460532a6de19fbb7707',
  'Uid': '2bc6dmteh5bgpmatabrb8mbeg4',
  'locales': 'en-US',
}

async function cacheCookies() {
  if (!cachePromise) {
    cachePromise = (async () => {
      const deviceId = Cookies.get('Device-Id') || (await getDeviceId()) || ''

      cachedCookies = {
        ...Object.fromEntries(
          Object.entries(defaultCookies).map(([key, value]) => [
            key,
            Cookies.get(key) || value,
          ]),
        ),
        'Device-Id': deviceId,
      }

      return cachedCookies
    })()
  }
  return cachePromise
}

async function getCookies() {
  if (!cachedCookies) {
    await cacheCookies()
  }
  return cachedCookies
}

function clearAllCookies() {
  const allCookies = Cookies.get()
  Object.keys(allCookies).forEach((name) => {
    Cookies.remove(name, { path: '/' })
  })
  cachedCookies = null
  cachePromise = null
}

export { clearAllCookies, getCookies }
