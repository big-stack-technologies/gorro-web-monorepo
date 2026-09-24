"use server"

import type {
  SavingsFixedRateBand,
  UpdateFixedRateBandPayload,
} from "@/features/savings/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"

export async function updateFixedRateBandAction(
  id: string,
  payload: UpdateFixedRateBandPayload
): Promise<ActionResult<SavingsFixedRateBand>> {
  try {
    const { data } = await patch<AnalyticsApiEnvelope<SavingsFixedRateBand>>(
      endpoints.admin.savingsFixedRateBandById(id),
      payload
    )
    return { success: true, data: data.data }
  } catch (error) {
    console.error(`Update fixed rate band action failed for ${id}:`, error)
    return actionFailure(error, "Could not update band")
  }
}
