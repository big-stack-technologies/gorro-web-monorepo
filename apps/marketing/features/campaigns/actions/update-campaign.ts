"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  MarketingCampaign,
  MarketingCampaignPayload,
} from "@/features/campaigns/types"

export async function updateCampaignAction(
  id: string,
  payload: Partial<MarketingCampaignPayload>
): Promise<ActionResult<MarketingCampaign>> {
  try {
    const { data } = await patch<MarketingCampaign>(
      endpoints.marketing.campaign(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Update campaign action failed:", error)
    return actionFailure(error, "Could not update campaign")
  }
}
