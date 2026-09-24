"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  MarketingCampaign,
  MarketingCampaignPayload,
} from "@/features/campaigns/types"

export async function createCampaignAction(
  payload: MarketingCampaignPayload
): Promise<ActionResult<MarketingCampaign>> {
  try {
    const { data } = await post<MarketingCampaign>(
      endpoints.marketing.campaigns,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Create campaign action failed:", error)
    return actionFailure(error, "Could not create campaign")
  }
}
