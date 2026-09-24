import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios"

import { ApiRequestError, type ApiError } from "./api-error"

export type CreateApiClientOptions = {
  baseURL: string
  getAccessToken: () => Promise<string | undefined>
  /** Browser path that clears the session, e.g. `/api/auth/logout`. */
  onUnauthorizedPath: string
  authLoginPath: string
  authLogoutPath: string
}

export function createApiClient(options: CreateApiClientOptions) {
  const apiClient = axios.create({
    baseURL: options.baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30_000,
  })

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await options.getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const requestUrl = error.config?.url ?? ""
      const isLoginRequest = requestUrl.includes(options.authLoginPath)
      const isLogoutRequest = requestUrl.includes(options.authLogoutPath)

      const apiError: ApiError = {
        message: error.message || "An unexpected error occurred",
        status,
      }

      const isTimeout =
        error.code === "ECONNABORTED" || /timeout/i.test(error.message)

      if (error.response) {
        apiError.message =
          (error.response.data as { message?: string })?.message ||
          error.message ||
          `Request failed with status ${error.response.status}`
      } else if (error.request) {
        apiError.message = isTimeout
          ? error.message || "Request timed out"
          : "No response received from server"
      }

      if (status === 401 && !isLoginRequest && !isLogoutRequest) {
        if (typeof window !== "undefined") {
          window.location.assign(options.onUnauthorizedPath)
        }
        return Promise.reject(new ApiRequestError(apiError.message, status))
      }

      return Promise.reject(new ApiRequestError(apiError.message, status))
    }
  )

  function get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return apiClient.get<T>(url, config)
  }

  function post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return apiClient.post<T>(url, data, config)
  }

  function patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return apiClient.patch<T>(url, data, config)
  }

  function put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return apiClient.put<T>(url, data, config)
  }

  function del<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return apiClient.delete<T>(url, config)
  }

  return { apiClient, get, post, patch, put, del }
}
