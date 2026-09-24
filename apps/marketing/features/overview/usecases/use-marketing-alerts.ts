"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/lib/query-keys"

import { getMarketingAlertsAction } from "@/features/overview/actions"
import type { MarketingAlerts } from "@/features/overview/types"

export function useMarketingAlerts(): UseQueryResult<MarketingAlerts, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.overview.alerts,
    queryFn: () => getMarketingAlertsAction(),
  })
}
