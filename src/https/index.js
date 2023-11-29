import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_HTTP,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  async (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

request.interceptors.response.use((response) => {
  return response.data
}, async (error) => {
  return Promise.reject(error)
})

export default request
