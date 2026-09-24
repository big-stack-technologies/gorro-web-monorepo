import { redirect, unstable_rethrow } from "next/navigation"

import { isApiError, post } from "@gorro/api/client"
import { removeAuthTokens } from "@gorro/api/cookies"
import { authEndpoints } from "@gorro/api/endpoints"

import type { LogoutResponse } from "./types"

export async function performLogout(loginPath: string) {
  try {
    await post<LogoutResponse>(authEndpoints.logout, {})
    await removeAuthTokens()
    redirect(loginPath)
  } catch (e) {
    unstable_rethrow(e)
    if (!isApiError(e)) {
      console.error(e)
    }
  }
}
