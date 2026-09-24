"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"

import type { MarketingTerritory } from "@/features/cgas/types"
import type { TerritoryUpdatePayload } from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function updateTerritoryAction(
  id: string,
  payload: TerritoryUpdatePayload
): Promise<ActionResult<MarketingTerritory>> {
  try {
    const { data } = await patch<MarketingTerritory>(
      endpoints.marketing.territory(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Update territory action failed:", error)
    return actionFailure(error, "Could not update territory")
  }
}
