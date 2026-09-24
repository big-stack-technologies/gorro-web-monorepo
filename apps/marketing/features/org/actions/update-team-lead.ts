"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"

import type { MarketingTeamLead } from "@/features/cgas/types"
import type { TeamLeadUpdatePayload } from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function updateTeamLeadAction(
  id: string,
  payload: TeamLeadUpdatePayload
): Promise<ActionResult<MarketingTeamLead>> {
  try {
    const { data } = await patch<MarketingTeamLead>(
      endpoints.marketing.teamLead(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Update team lead action failed:", error)
    return actionFailure(error, "Could not update team lead")
  }
}
