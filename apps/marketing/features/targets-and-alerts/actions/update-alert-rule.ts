"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  MarketingAlertRule,
  UpdateMarketingAlertRulePayload,
} from "@/features/targets-and-alerts/types"

export async function updateAlertRuleAction(
  code: string,
  payload: UpdateMarketingAlertRulePayload
): Promise<ActionResult<MarketingAlertRule>> {
  try {
    const { data } = await patch<MarketingAlertRule>(
      endpoints.marketing.alertRule(code),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Update alert rule action failed for ${code}:`, error)
    return actionFailure(error, "Could not update alert rule")
  }
}
