import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const isProd = import.meta.env.PROD;
const defaultBaseUrl = isProd ? '/_/backend/api/v1' : 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl,
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
