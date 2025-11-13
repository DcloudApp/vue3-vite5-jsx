import { getCookies } from './cookieManager'
// import { encryption } from './encryption'
import { getReqKey } from './requestCache'
import request from './requestConfig'

const cacheRequest = {}
const cacheWhiteList = []

function removeCacheRequest(reqKey) {
  if (cacheRequest[reqKey]) {
    cacheRequest[reqKey].abort()
    delete cacheRequest[reqKey]
  }
}

request.interceptors.request.use(
  async (config) => {
    const cookies = await getCookies()
    config.headers = {
      ...config.headers,
      ...cookies,
    }
    // config.data = encryption(config.data)

    const { url, method, data, params } = config
    const reqKey = getReqKey(url, method, params, data)
    config.__reqKey = reqKey

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

export { removeCacheRequest } // 导出 removeCacheRequest 函数
export default request
