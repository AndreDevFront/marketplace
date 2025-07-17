import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getAuthToken, removeAuthToken, normalizeApiError } from '@/lib/auth.utils'

type RequestData = Record<string, unknown> | FormData | string | number | boolean | null | undefined

type HttpError = {
  config?: InternalAxiosRequestConfig
  response?: AxiosResponse
  message?: string
  code?: string
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cards-marketplace-api-2fjj.onrender.com'
const REQUEST_TIMEOUT = 10000


class HttpClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => this.addAuthToken(config),
      (error: unknown) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => this.handleSuccessResponse(response),
      (error: unknown) => this.handleErrorResponse(error)
    )
  }

  private addAuthToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = getAuthToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }

  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }

    return response
  }

  private async handleErrorResponse(error: unknown): Promise<never> {
    const normalizedError = normalizeApiError(error)

    if (import.meta.env.DEV) {
      const httpError = error as HttpError
      console.error(`❌ ${httpError.config?.method?.toUpperCase()} ${httpError.config?.url}`, {
        status: normalizedError.statusCode,
        code: normalizedError.code,
        message: normalizedError.message
      })
    }

    if (normalizedError.statusCode === 401) {
      await this.handleUnauthorized()
    }

    return Promise.reject(normalizedError)
  }

  private async handleUnauthorized(): Promise<void> {
    removeAuthToken()

    if (!window.location.pathname.includes('/auth')) {
      window.location.href = '/auth/login'
    }
  }


  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config)
    return response.data
  }

  async post<T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config)
    return response.data
  }

  async put<T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config)
    return response.data
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config)
    return response.data
  }

  async patch<T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config)
    return response.data
  }

  setAuthToken(token: string): void {
    if (this.instance.defaults.headers) {
      this.instance.defaults.headers.Authorization = `Bearer ${token}`
    }
  }

  clearAuthToken(): void {
    if (this.instance.defaults.headers) {
      delete this.instance.defaults.headers.Authorization
    }
  }

  getBaseURL(): string {
    return this.instance.defaults.baseURL || ''
  }

  setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout
  }
}


export const httpClient = new HttpClient()

export const { get, post, put, delete: del, patch } = httpClient
