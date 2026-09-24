"use server"

import type { WithdrawalsReasonPayload } from "@/features/users/schema"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function disableUserWithdrawalsAction(
  id: string,
  payload: WithdrawalsReasonPayload
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.userWithdrawalsDisableById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Disable user withdrawals action failed for ${id}:`, error)
    return actionFailure(error, "Could not disable withdrawals")
  }
}
