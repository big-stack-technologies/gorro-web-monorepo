"use server"

import { get } from "@gorro/api/client"

import { buildPeriodParams } from "@/features/analytics/actions/build-params"
import type {
  AnalyticsPeriodFilters,
  MarketingFunnelResponse,
} from "@/features/analytics/types"
import { endpoints } from "@/lib/endpoints"

export async function getMarketingFunnelAction(
  filters: AnalyticsPeriodFilters = {}
): Promise<MarketingFunnelResponse> {
  try {
    const { data } = await get<MarketingFunnelResponse>(
      endpoints.marketing.funnel,
      { params: buildPeriodParams(filters) }
    )
    return data
  } catch (error) {
    console.error("Failed to load marketing funnel:", error)
    throw error
  }
}
