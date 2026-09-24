"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getMarketingTrendsAction } from "@/features/analytics/actions"
import type {
  MarketingTrendsFilters,
  MarketingTrendsResponse,
} from "@/features/analytics/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: MarketingTrendsFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>
}

export function useMarketingTrends(
  filters: MarketingTrendsFilters
): UseQueryResult<MarketingTrendsResponse, Error> {
  const key = filtersKey(filters)

  return useQuery({
    queryKey: QUERY_KEYS.analytics.trends(key),
    queryFn: () => getMarketingTrendsAction(filters),
  })
}
