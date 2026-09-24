/**
 * Shared API error shape and type guard. Safe to import from Client Components
 * (no axios / next/headers).
 */
export type ApiError = {
  message: string
  status: number | undefined
}

/** Thrown by axios — serializable from Server Actions (unlike plain ApiError objects). */
export class ApiRequestError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
  }
}

export function isApiError(
  value: unknown
): value is ApiError | ApiRequestError {
  if (value instanceof ApiRequestError) return true
  if (typeof value !== "object" || value === null) return false
  const o = value as Partial<ApiError>
  if (typeof o.message !== "string") return false
  if (o.status !== undefined && typeof o.status !== "number") return false
  return true
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) return error.message
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return String(error)
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (error instanceof ApiRequestError) return error.status
  if (isApiError(error)) return error.status
  return undefined
}

export function isApiTimeoutError(error: unknown): boolean {
  const status = getApiErrorStatus(error)
  if (status === 408 || status === 504) return true

  return /timeout/i.test(getApiErrorMessage(error))
}
