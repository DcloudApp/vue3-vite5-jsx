import { isCancel } from 'axios'

import { handleErrorCode } from './errorHandler'
import request from './requestConfig'
// responseInterceptor.js
import { removeCacheRequest } from './requestInterceptor'

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
      return new Promise(() => {})
    }
    if (error.response) {
      const { code } = error.response?.data
      handleErrorCode(code)
    }

    return !isCancel(error) && Promise.reject(error)
  },
)
