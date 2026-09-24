import {
  getApiErrorMessage,
  isApiTimeoutError,
} from "@gorro/api/api-error"

export function getFriendlyBvnErrorMessage(error: unknown): string {
  if (isApiTimeoutError(error)) {
    return "Provider timed out — try again"
  }

  return getApiErrorMessage(error)
}
