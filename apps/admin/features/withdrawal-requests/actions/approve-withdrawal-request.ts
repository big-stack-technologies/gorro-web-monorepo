"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function approveWithdrawalRequestAction(
  id: string
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.withdrawalRequestApproveById(id),
      {}
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Approve withdrawal request action failed for ${id}:`, error)
    return actionFailure(error, "Could not approve withdrawal request")
  }
}
