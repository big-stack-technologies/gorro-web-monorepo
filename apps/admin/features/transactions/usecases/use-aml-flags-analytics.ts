"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getAmlFlagsAnalyticsAction } from "@/features/transactions/actions"
import type { AmlFlagsAnalytics } from "@/features/transactions/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useAmlFlagsAnalytics(): UseQueryResult<AmlFlagsAnalytics, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.amlFlags,
    queryFn: () => getAmlFlagsAnalyticsAction(),
  })
}
