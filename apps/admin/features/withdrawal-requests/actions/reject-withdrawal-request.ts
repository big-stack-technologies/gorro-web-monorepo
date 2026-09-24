"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function rejectWithdrawalRequestAction(
  id: string
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.withdrawalRequestRejectById(id),
      {}
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Reject withdrawal request action failed for ${id}:`, error)
    return actionFailure(error, "Could not reject withdrawal request")
  }
}
