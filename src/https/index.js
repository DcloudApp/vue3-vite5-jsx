import axios from 'axios'

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
request.interceptors.request.use(
  async (config) => {
    // 移除参数中为 null、空字符串、空数组或空对象的字段
    if (config.headers['Content-Type'] && config.headers['Content-Type'].startsWith('multipart/form-data')) {
      // 文件上传直接返回config，不做处理
      return config
    }
    ['params', 'data'].forEach((key) => {
      if (config[key]) {
        Object.keys(config[key]).forEach((param) => {
          const value = config[key][param]
          if (value === null || value === '' || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0))
            delete config[key][param]
        })
      }
    })
    const { url, method } = config
    // 请求地址和请求方式组成唯一标识，将这个标识作为取消函数的key，保存到请求队列中
    const reqKey = `${url}&${method}`
    // 如果存在重复请求，删除之前的请求
    if (!cacheWhiteList.includes(reqKey)) {
      removeCacheRequest(reqKey)
      // 将请求加入请求队列，通过AbortController来进行手动取消
      const controller = new AbortController()
      config.signal = controller.signal
      cacheRequest[reqKey] = controller
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const { url, method } = response.config
    removeCacheRequest(`${url}&${method}`)
    return response.data
  },
  async (error) => {
    if (!isCancel(error))
      return Promise.reject(error)
    else
      return {}
  },
)

export default request
