"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  CampaignListFilters,
  MarketingCampaign,
} from "@/features/campaigns/types"

export async function listCampaignsAction(
  filters: CampaignListFilters = {}
): Promise<MarketingCampaign[]> {
  try {
    const params: Record<string, string> = {}
    if (filters.territoryId) params.territoryId = filters.territoryId

    const { data } = await get<MarketingCampaign[]>(
      endpoints.marketing.campaigns,
      { params }
    )
    return data
  } catch (error) {
    console.error("Failed to load campaigns:", error)
    throw error
  }
}
