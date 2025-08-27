import md5 from 'js-md5'

// 请求缓存，用于避免重复计算相同的请求
const requestCache = new Map()

// 排序对象的键并返回排序后的 key-value 字符串
function sortObjectToString(obj) {
  if (!obj || typeof obj !== 'object')
    return ''
  const sortedKeys = Object.keys(obj).sort()
  return sortedKeys
    .map((key) => {
      const value = obj[key]
      if (Array.isArray(value)) {
        return `${key}=[${value.join(',')}]`
      }
      else if (typeof value === 'boolean') {
        return `${key}=${value ? 'true' : 'false'}`
      }
      else if (typeof value === 'number') {
        return `${key}=${value}`
      }
      else {
        return `${key}=${String(value)}`
      }
    })
    .join('&')
}

// 生成唯一请求标识
function getReqKey(url, method, params = {}, data = {}) {
  const cacheKey = `${url}&${method}&${JSON.stringify(params)}&${JSON.stringify(data)}`

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)
  }

  const sortedParams = sortObjectToString(params)
  const sortedData = sortObjectToString(data)

  const combinedString = [url, method, sortedParams, sortedData].join('&')

  const reqKey = md5(combinedString)

  requestCache.set(cacheKey, reqKey)

  return reqKey
}

export { getReqKey }
