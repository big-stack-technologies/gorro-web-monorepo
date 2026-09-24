import {
  ApiRequestError,
  getApiErrorMessage,
  getApiErrorStatus,
  isApiError,
  isApiTimeoutError,
  type ApiError,
} from "./api-error"
import { createApiClient } from "./axios"
import { getAuthAccessToken } from "./cookies"
import { authEndpoints } from "./endpoints"
import { env } from "./env"

const client = createApiClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  getAccessToken: getAuthAccessToken,
  onUnauthorizedPath: "/api/auth/logout",
  authLoginPath: authEndpoints.login,
  authLogoutPath: authEndpoints.logout,
})

export const { apiClient, get, post, patch, put, del } = client

export {
  ApiRequestError,
  getApiErrorMessage,
  getApiErrorStatus,
  isApiError,
  isApiTimeoutError,
  type ApiError,
}
