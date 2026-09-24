"use server"

import type { TransactionReasonPayload } from "@/features/transactions/schema"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function approveTransactionAction(
  id: string,
  payload: TransactionReasonPayload
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.transactionApproveAmlById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Approve transaction action failed for ${id}:`, error)
    return actionFailure(error, "Could not approve transaction")
  }
}
