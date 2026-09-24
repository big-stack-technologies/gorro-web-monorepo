"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import type {
  MarketingCommunity,
  MarketingCommunityPayload,
} from "@/features/communities/types"
import { endpoints } from "@/lib/endpoints"

export async function createCommunityAction(
  payload: MarketingCommunityPayload
): Promise<ActionResult<MarketingCommunity>> {
  try {
    const { data } = await post<MarketingCommunity>(
      endpoints.marketing.communities,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Create community action failed:", error)
    return actionFailure(error, "Could not create community")
  }
}
