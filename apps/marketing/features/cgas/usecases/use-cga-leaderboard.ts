"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getCgaPerformanceAction,
  listMarketingCgasAction,
} from "@/features/cgas/actions"
import type { CgaPerformanceFilters } from "@/features/cgas/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>
}

/** Loads roster placement and period performance. Performance is the KPI source. */
export function useCgaPageData(performanceFilters: CgaPerformanceFilters) {
  const performanceKey = filtersKey(performanceFilters)

  const placements = useQuery({
    queryKey: QUERY_KEYS.cgas.list,
    queryFn: () => listMarketingCgasAction(),
  })

  const performance = useQuery({
    queryKey: QUERY_KEYS.cgas.performance(performanceKey),
    queryFn: () => getCgaPerformanceAction(performanceFilters),
  })

  return { placements, performance }
}

/** @deprecated Use useCgaPageData */
export const useCgaLeaderboard = useCgaPageData
