"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getCgaMetricsTrendsAction } from "@/features/cgas/actions"
import type {
  CgaMetricsTrendsResponse,
  CgaTrendsFilters,
} from "@/features/cgas/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCgaMetricsTrends(
  filters: CgaTrendsFilters
): UseQueryResult<CgaMetricsTrendsResponse, Error> {
  const key = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>

  return useQuery({
    queryKey: QUERY_KEYS.cgas.metricsTrends(key),
    queryFn: () => getCgaMetricsTrendsAction(filters),
  })
}
