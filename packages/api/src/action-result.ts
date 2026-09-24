import {
  ApiRequestError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "./api-error"

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number }

export function actionFailure(
  error: unknown,
  fallback = "Something went wrong. Try again."
): ActionResult<never> {
  return {
    success: false,
    error: getApiErrorMessage(error) || fallback,
    status: getApiErrorStatus(error),
  }
}

export function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (!result.success) {
    throw new ApiRequestError(result.error, result.status)
  }
  return result.data
}
