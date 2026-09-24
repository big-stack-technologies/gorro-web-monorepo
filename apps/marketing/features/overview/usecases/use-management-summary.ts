"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/lib/query-keys"

import { getManagementSummaryAction } from "@/features/overview/actions"
import type { MarketingManagementSummary } from "@/features/overview/types"

export function useManagementSummary(): UseQueryResult<
  MarketingManagementSummary,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.overview.management,
    queryFn: () => getManagementSummaryAction(),
  })
}
