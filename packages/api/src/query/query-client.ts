import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"

import { ApiRequestError, getApiErrorMessage, isApiError } from "../api-error"

/** Next.js replaces server-action 401 failures with this opaque client error. */
const SERVER_ACTION_UNEXPECTED_RESPONSE =
  "An unexpected response was received from the server."

export type QueryClientOptions = {
  sessionClearPath: string
  protectedPathPrefix: string
}

function isServerActionSessionFailure(
  error: unknown,
  protectedPathPrefix: string
): boolean {
  if (typeof window === "undefined") return false
  if (getApiErrorMessage(error) !== SERVER_ACTION_UNEXPECTED_RESPONSE) return false
  return window.location.pathname.startsWith(protectedPathPrefix)
}

function isUnauthorizedError(
  error: unknown,
  protectedPathPrefix: string
): boolean {
  if (error instanceof ApiRequestError && error.status === 401) return true
  if (isApiError(error) && error.status === 401) return true
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number" &&
    (error as { status: number }).status === 401
  ) {
    return true
  }
  if (isServerActionSessionFailure(error, protectedPathPrefix)) return true
  return false
}

function redirectToLoginIfUnauthorized(
  error: unknown,
  options: QueryClientOptions
) {
  if (typeof window === "undefined") return
  if (!isUnauthorizedError(error, options.protectedPathPrefix)) return
  window.location.assign(options.sessionClearPath)
}

function shouldRetry(
  failureCount: number,
  error: unknown,
  protectedPathPrefix: string
): boolean {
  if (isUnauthorizedError(error, protectedPathPrefix)) return false
  return failureCount < 1
}

export function createQueryClient(options: QueryClientOptions): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) =>
          shouldRetry(failureCount, error, options.protectedPathPrefix),
        refetchOnWindowFocus: process.env.NODE_ENV === "development",
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => redirectToLoginIfUnauthorized(error, options),
    }),
    mutationCache: new MutationCache({
      onError: (error) => redirectToLoginIfUnauthorized(error, options),
    }),
  })
}
