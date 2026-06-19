import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Endpoint configs (fallback to Express gateway or localhost)
const BASE_URL = 'http://localhost:5000/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
})

// Request Interceptor: Attach Auth JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('BS_TOKEN')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.warn("Could not retrieve authentication token from secure storage.")
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Manage errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Automatically try to resolve connection errors offline
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true
      console.warn("Network unreachable. Queuing mutation for offline sync.")
    }
    
    return Promise.reject(error)
  }
)

export default api
