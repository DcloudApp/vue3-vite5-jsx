import axios from 'axios'
import Fingerprint2 from 'fingerprintjs2'
import Cookies from 'js-cookie'
import md5 from 'js-md5'
import useLogin from '@/hooks/useLogin'

const request = axios.create({
  baseURL: import.meta.env.VITE_HTTP,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const { isCancel } = axios
// 请求队列，缓存发出的请求
const cacheRequest = {}
// 不进行重复请求拦截的白名单
const cacheWhiteList = ['']

function removeCacheRequest(reqKey) {
  if (cacheRequest[reqKey]) {
    // 通过AbortController实例上的abort来进行请求的取消
    cacheRequest[reqKey].abort()
    delete cacheRequest[reqKey]
  }
}

async function getDeviceId() {
  const cachedDeviceId = localStorage.getItem('DeviceId')
  if (cachedDeviceId)
    return cachedDeviceId

  const components = await new Promise((resolve) => {
    Fingerprint2.get(resolve)
  })

  const values = components.map((component, index) =>
    index === 0 ? component.value.replace(/\bNetType\/\w+\b/, '') : component.value,
  )

  const DeviceId = Fingerprint2.x64hash128(values.join(''), 31)
  const encodedDeviceId = md5(window.btoa(DeviceId + window.location.host))
  localStorage.setItem('DeviceId', encodedDeviceId)
  return encodedDeviceId
}

request.interceptors.request.use(
  async (config) => {
    const { userInfo } = useLogin()
    const deviceId = await getDeviceId() // 确保 getDeviceId 返回 Promise 的结果
    config.headers = {
      ...config.headers,
      'Version-Code': Cookies.get('Version-Code') || 1,
      'Device-Type': Cookies.get('Device-Type') || 'web',
      'Device-Id': Cookies.get('Device-Id') || deviceId || '',
      'token': Cookies.get('token') || userInfo.value.token || '',
      'Uid': Cookies.get('Uid') || userInfo.value.guid || '',
    }

    // 重复请求标记
    const { url, method, data, params } = config
    const reqKey = `${url}&${method}&${JSON.stringify(params || '')}&${JSON.stringify(data || '')}`

    if (!cacheWhiteList.includes(reqKey)) {
      removeCacheRequest(reqKey)
      const controller = new AbortController()
      config.signal = controller.signal
      cacheRequest[reqKey] = controller
    }
    return config
  },
  error => Promise.reject(error),
)

const errorHandlers = {
  440: handleUnauthorized,
  401: handleUnauthorized,
}

function handleErrorCode(code) {
  if (errorHandlers[code]) {
    errorHandlers[code]()
  }
}

request.interceptors.response.use(
  (response) => {
    const { url, method } = response.config
    removeCacheRequest(`${url}&${method}`)

    const { code } = response?.data
    handleErrorCode(code)
    return response.data
  },
  async (error) => {
    if (isCancel(error)) {
      return new Promise(() => {}) // 不做任何处理，跳过
    }
    if (error.response) {
      const { code } = error.response?.data
      handleErrorCode(code)
    }

    return !isCancel(error) && Promise.reject(error)
  },
)

function handleUnauthorized() {
  const { setUserInfo } = useLogin()
  setUserInfo({})
  Cookies.remove('token', { path: '/' })
  window.location.href = '/account/login'
}

export default request
