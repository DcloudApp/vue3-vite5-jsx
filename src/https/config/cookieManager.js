import Cookies from 'js-cookie'
import useAuth from '@/hooks/useAuth'
import { getDeviceId } from './device'

const isDev = import.meta.env.MODE === 'dev'

// 生产环境默认值
const PROD_COOKIE_DEFAULTS = {
  'Version-Code': 1,
  'Device-Type': 'web',
  'language': '',
  'token': '',
  'Uid': '',
}

// 测试环境默认值
const TEST_COOKIE_DEFAULTS = {
  ...PROD_COOKIE_DEFAULTS,
  token: 'cb1c7e89b207afddf431589d03119735',
  Uid: 'dqv04ognd2iilphu2fmoosbgks',
}

const COOKIE_DEFAULTS = isDev ? TEST_COOKIE_DEFAULTS : PROD_COOKIE_DEFAULTS

// 初始化默认Cookie（如果不存在）
async function initDefaultCookies() {
  const deviceId = Cookies.get('Device-Id') || (await getDeviceId()) || ''
  if (!Cookies.get('Device-Id') && deviceId) {
    Cookies.set('Device-Id', deviceId, { path: '/' })
  }

  // 设置默认Cookie（仅当它们不存在时）
  Object.entries(COOKIE_DEFAULTS).forEach(([key, value]) => {
    if (Cookies.get(key) === undefined) {
      Cookies.set(key, value, { path: '/' })
    }
  })
}

// 直接从Cookie获取值，不使用缓存
async function getCookies() {
  await initDefaultCookies() // 确保默认Cookie已设置

  const deviceId = Cookies.get('Device-Id') || ''
  return {
    ...Object.fromEntries(
      Object.entries(COOKIE_DEFAULTS).map(([key, value]) => [
        key,
        Cookies.get(key) || value,
      ]),
    ),
    'Device-Id': deviceId,
  }
}

// 设置Cookie
function setCookie(name, value, options = {}) {
  const cookieOptions = { path: '/', ...options }
  Cookies.set(name, value, cookieOptions)
}

function clearAllCookies() {
  const { updateUser } = useAuth()
  // 清除所有Cookie
  const allCookies = Cookies.get()
  Object.keys(allCookies).forEach((name) => {
    Cookies.remove(name, { path: '/' })
  })

  updateUser(null)
}

export { clearAllCookies, getCookies, initDefaultCookies, setCookie }
