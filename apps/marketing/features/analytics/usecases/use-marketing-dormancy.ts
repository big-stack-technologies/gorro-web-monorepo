"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getMarketingDormancyAction } from "@/features/analytics/actions"
import type { MarketingDormancyResponse } from "@/features/analytics/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useMarketingDormancy(): UseQueryResult<
  MarketingDormancyResponse,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.dormancy({}),
    queryFn: () => getMarketingDormancyAction(),
  })
}
