"use server"

import { get } from "@gorro/api/client"

import type { MarketingDormancyResponse } from "@/features/analytics/types"
import { endpoints } from "@/lib/endpoints"

export async function getMarketingDormancyAction(): Promise<MarketingDormancyResponse> {
  try {
    const { data } = await get<MarketingDormancyResponse>(
      endpoints.marketing.dormancy
    )
    return data
  } catch (error) {
    console.error("Failed to load marketing dormancy:", error)
    throw error
  }
}
