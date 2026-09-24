"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/lib/query-keys"

import { getMarketingSummaryAction } from "@/features/overview/actions"
import type { MarketingSummary } from "@/features/overview/types"

export function useMarketingSummary(): UseQueryResult<MarketingSummary, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.overview.summary,
    queryFn: () => getMarketingSummaryAction(),
  })
}
