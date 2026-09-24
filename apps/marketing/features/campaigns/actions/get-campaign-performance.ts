"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingCampaignPerformance } from "@/features/campaigns/types"

export async function getCampaignPerformanceAction(
  id: string
): Promise<MarketingCampaignPerformance> {
  try {
    const { data } = await get<MarketingCampaignPerformance>(
      endpoints.marketing.campaignPerformance(id)
    )
    return data
  } catch (error) {
    console.error("Failed to load campaign performance:", error)
    throw error
  }
}
