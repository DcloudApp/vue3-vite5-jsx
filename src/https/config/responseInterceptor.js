import { isCancel } from 'axios'

import { handleErrorCode } from './errorHandler'
import request from './requestConfig'
import { removeCacheRequest } from './requestInterceptor'

request.interceptors.response.use(
  (response) => {
    const { __reqKey } = response.config
    if (__reqKey)
      removeCacheRequest(__reqKey)

    const { code } = response?.data
    handleErrorCode(code)
    return response.data
  },
  async (error) => {
    const reqKey = error?.config?.__reqKey
    if (reqKey)
      removeCacheRequest(reqKey)
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
