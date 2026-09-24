"use server"

import type { TransactionReasonPayload } from "@/features/transactions/schema"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function rejectTransactionAction(
  id: string,
  payload: TransactionReasonPayload
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.transactionRejectById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Reject transaction action failed for ${id}:`, error)
    return actionFailure(error, "Could not reject transaction")
  }
}
