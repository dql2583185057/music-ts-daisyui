import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/userStore'

// 创建请求实例
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 封装请求方法
export default {
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return instance.get<T, AxiosResponse<T>>(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post<T, AxiosResponse<T>>(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.put<T, AxiosResponse<T>>(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<T, AxiosResponse<T>>(url, config)
  }
} 