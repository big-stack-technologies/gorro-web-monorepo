"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getSavingsMetricsSummaryAction } from "@/features/savings/actions"
import type {
  SavingsMetricsSummary,
  SavingsMetricsSummaryParams,
} from "@/features/savings/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useSavingsMetricsSummary(
  filters: SavingsMetricsSummaryParams = {}
): UseQueryResult<SavingsMetricsSummary, Error> {
  const filterKey = {
    product: filters.product ?? "",
    from: filters.from ?? "",
    to: filters.to ?? "",
  }

  return useQuery({
    queryKey: QUERY_KEYS.savings.metricsSummary(filterKey),
    queryFn: () => getSavingsMetricsSummaryAction(filters),
  })
}
