"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getCgaMetricsSummaryAction,
  getCgaPerformanceAction,
  listMarketingCgasAction,
} from "@/features/cgas/actions"
import type {
  CgaMetricsFilters,
  CgaPerformanceFilters,
} from "@/features/cgas/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>
}

/** Loads the three CGA endpoints separately (no client merge). */
export function useCgaPageData(
  metricsFilters: CgaMetricsFilters,
  performanceFilters: CgaPerformanceFilters | null
) {
  const metricsKey = filtersKey(metricsFilters)
  const performanceKey = performanceFilters
    ? filtersKey(performanceFilters)
    : null

  const summary = useQuery({
    queryKey: QUERY_KEYS.cgas.metricsSummary(metricsKey),
    queryFn: () => getCgaMetricsSummaryAction(metricsFilters),
  })

  const placements = useQuery({
    queryKey: QUERY_KEYS.cgas.list,
    queryFn: () => listMarketingCgasAction(),
  })

  const performance = useQuery({
    queryKey: performanceKey
      ? QUERY_KEYS.cgas.performance(performanceKey)
      : ["marketing", "cgas", "performance", "disabled"],
    queryFn: () => getCgaPerformanceAction(performanceFilters!),
    enabled:
      performanceFilters != null && Boolean(performanceFilters.territoryId),
  })

  return { summary, placements, performance }
}

/** @deprecated Use useCgaPageData */
export const useCgaLeaderboard = useCgaPageData
