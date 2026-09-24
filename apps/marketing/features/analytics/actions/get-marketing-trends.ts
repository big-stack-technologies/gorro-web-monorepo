"use server"

import { get } from "@gorro/api/client"

import { buildTrendsParams } from "@/features/analytics/actions/build-params"
import type {
  MarketingTrendsFilters,
  MarketingTrendsResponse,
} from "@/features/analytics/types"
import { endpoints } from "@/lib/endpoints"

export async function getMarketingTrendsAction(
  filters: MarketingTrendsFilters
): Promise<MarketingTrendsResponse> {
  try {
    const { data } = await get<MarketingTrendsResponse>(
      endpoints.marketing.trends,
      { params: buildTrendsParams(filters) }
    )
    return data
  } catch (error) {
    console.error("Failed to load marketing trends:", error)
    throw error
  }
}
