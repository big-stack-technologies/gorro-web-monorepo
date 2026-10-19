"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"
import type {
  CreditWalletPayload,
  CreditWalletResult,
} from "@/features/wallet-credits/types"
import { endpoints } from "@/lib/endpoints"

export async function creditWalletAction(
  payload: CreditWalletPayload
): Promise<ActionResult<CreditWalletResult>> {
  try {
    const { data } = await post<AnalyticsApiEnvelope<CreditWalletResult>>(
      endpoints.admin.walletCredits,
      payload
    )
    return { success: true, data: data.data }
  } catch (error) {
    console.error("Credit wallet action failed:", error)
    return actionFailure(error, "Could not credit wallet")
  }
}
