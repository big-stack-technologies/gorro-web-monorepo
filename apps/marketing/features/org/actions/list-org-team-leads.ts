"use server"

import { get } from "@gorro/api/client"

import type { MarketingTeamLead } from "@/features/cgas/types"
import type { OrgListOptions } from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function listOrgTeamLeadsAction(
  options: OrgListOptions = {}
): Promise<MarketingTeamLead[]> {
  try {
    const params: Record<string, string> = {}
    if (options.includeInactive) {
      params.includeInactive = "true"
    }
    const { data } = await get<MarketingTeamLead[]>(
      endpoints.marketing.teamLeads,
      { params }
    )
    return data
  } catch (error) {
    console.error("Failed to load org team leads:", error)
    throw error
  }
}
