// plugins/axios.ts
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'
  
  const api = axios.create({
    baseURL: apiBase,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  api.interceptors.request.use(
  (config) => {
    if (process.client) {
      // localStorage ን ከመጥራትህ በፊት window መኖሩን ቼክ አድርግ
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)
  
  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (process.client) {
          localStorage.removeItem('auth_token')
          window.localStorage.removeItem('auth_user')
          localStorage.removeItem('userRole')
        }
        navigateTo('/auth')
      }
      return Promise.reject(error)
    }
  )
  
  return {
    provide: {
      axios: api
    }
  }
})