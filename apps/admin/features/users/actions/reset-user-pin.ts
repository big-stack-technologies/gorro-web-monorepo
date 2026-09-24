"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function resetUserPinAction(
  id: string
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.userResetPinById(id),
      {}
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Reset user PIN action failed for ${id}:`, error)
    return actionFailure(error, "Could not reset PIN")
  }
}
