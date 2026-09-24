"use server"

import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import type {
  VerifyUserBvnData,
  VerifyUserBvnPayload,
  VerifyUserBvnResponse,
} from "@/features/users/types"

export async function verifyUserBvnAction(
  userId: string,
  payload: VerifyUserBvnPayload
): Promise<ActionResult<VerifyUserBvnData>> {
  try {
    const { data } = await post<VerifyUserBvnResponse>(
      endpoints.accountProviders.fincraBvnResolution,
      payload
    )

    if (!data.success) {
      return {
        success: false,
        error: data.message || "BVN verification failed",
      }
    }

    return { success: true, data: data.data }
  } catch (error) {
    console.error(`Verify BVN action failed for user ${userId}:`, error)
    return actionFailure(error, "Could not verify BVN")
  }
}
