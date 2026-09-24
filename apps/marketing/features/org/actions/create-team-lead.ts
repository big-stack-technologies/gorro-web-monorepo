"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import type { MarketingTeamLead } from "@/features/cgas/types"
import type { TeamLeadPayload } from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function createTeamLeadAction(
  payload: TeamLeadPayload
): Promise<ActionResult<MarketingTeamLead>> {
  try {
    const { data } = await post<MarketingTeamLead>(
      endpoints.marketing.teamLeads,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Create team lead action failed:", error)
    return actionFailure(error, "Could not create team lead")
  }
}
