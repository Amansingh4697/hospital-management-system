import axios from 'axios'

// Local dev:  VITE_API_URL is not set → falls back to http://localhost:8080
// Production: set VITE_API_URL=https://your-backend.onrender.com in Render dashboard
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({ baseURL: BASE_URL })

// Automatically attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
