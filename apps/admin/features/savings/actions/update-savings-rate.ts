"use server"

import type {
  SavingsProductType,
  SavingsRateConfig,
  UpdateSavingsRatePayload,
} from "@/features/savings/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"

export async function updateSavingsRateAction(
  productType: SavingsProductType,
  payload: UpdateSavingsRatePayload
): Promise<ActionResult<SavingsRateConfig>> {
  try {
    const { data } = await patch<AnalyticsApiEnvelope<SavingsRateConfig>>(
      endpoints.admin.savingsRateByProduct(productType),
      payload
    )
    return { success: true, data: data.data }
  } catch (error) {
    console.error(
      `Update savings rate action failed for ${productType}:`,
      error
    )
    return actionFailure(error, "Could not update rate")
  }
}
