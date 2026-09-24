"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getMarketingFunnelAction } from "@/features/analytics/actions"
import type {
  AnalyticsPeriodFilters,
  MarketingFunnelResponse,
} from "@/features/analytics/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: AnalyticsPeriodFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>
}

export function useMarketingFunnel(
  filters: AnalyticsPeriodFilters
): UseQueryResult<MarketingFunnelResponse, Error> {
  const key = filtersKey(filters)

  return useQuery({
    queryKey: QUERY_KEYS.analytics.funnel(key),
    queryFn: () => getMarketingFunnelAction(filters),
  })
}
