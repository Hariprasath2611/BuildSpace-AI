import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // If we are deployed (not on localhost), force the relative backend path
    return '/_/backend/api/v1'
  }
  // Otherwise use local dev URL
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default api
