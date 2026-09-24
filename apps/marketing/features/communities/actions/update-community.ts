"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"

import type {
  MarketingCommunity,
  MarketingCommunityUpdatePayload,
} from "@/features/communities/types"
import { endpoints } from "@/lib/endpoints"

export async function updateCommunityAction(
  id: string,
  payload: MarketingCommunityUpdatePayload
): Promise<ActionResult<MarketingCommunity>> {
  try {
    const { data } = await patch<MarketingCommunity>(
      endpoints.marketing.community(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Update community action failed:", error)
    return actionFailure(error, "Could not update community")
  }
}
