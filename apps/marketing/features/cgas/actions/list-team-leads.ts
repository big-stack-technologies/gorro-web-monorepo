"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingTeamLead } from "@/features/cgas/types"

export async function listTeamLeadsAction(): Promise<MarketingTeamLead[]> {
  try {
    const { data } = await get<MarketingTeamLead[]>(endpoints.marketing.teamLeads)
    return data.filter((row) => row.isActive)
  } catch (error) {
    console.error("Failed to load team leads:", error)
    throw error
  }
}
