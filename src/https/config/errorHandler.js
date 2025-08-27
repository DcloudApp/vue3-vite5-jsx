// errorHandler.js
import { clearAllCookies } from './cookieManager'

function handleUnauthorized() {
  clearAllCookies()
}

const errorHandlers = {
  440: handleUnauthorized,
  401: handleUnauthorized,
}

function handleErrorCode(code) {
  if (errorHandlers[code]) {
    errorHandlers[code]()
  }
}

export { handleErrorCode }
