"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getDashboardSummaryAction } from "@/features/dashboard/actions"
import type { DashboardPeriod, DashboardSummary } from "@/features/dashboard/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useDashboardSummary(
  period: DashboardPeriod
): UseQueryResult<DashboardSummary, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.summary(period),
    queryFn: () => getDashboardSummaryAction(period),
  })
}
