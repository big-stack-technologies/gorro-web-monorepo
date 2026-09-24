"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  MarketingTarget,
  MarketingTargetPayload,
} from "@/features/targets-and-alerts/types"

export async function setMarketingTargetAction(
  payload: MarketingTargetPayload
): Promise<ActionResult<MarketingTarget>> {
  try {
    const { data } = await post<MarketingTarget>(
      endpoints.marketing.targets,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Set marketing target action failed:", error)
    return actionFailure(error, "Could not save target")
  }
}
