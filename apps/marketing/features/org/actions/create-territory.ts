"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import type { MarketingTerritory } from "@/features/cgas/types"
import type { TerritoryPayload } from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function createTerritoryAction(
  payload: TerritoryPayload
): Promise<ActionResult<MarketingTerritory>> {
  try {
    const { data } = await post<MarketingTerritory>(
      endpoints.marketing.territories,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Create territory action failed:", error)
    return actionFailure(error, "Could not create territory")
  }
}
