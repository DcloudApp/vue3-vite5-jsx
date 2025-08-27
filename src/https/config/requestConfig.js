import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_HTTP,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default request
