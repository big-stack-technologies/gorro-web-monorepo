"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getMarketingTargetsAction } from "@/features/targets-and-alerts/actions"
import type { MarketingTarget } from "@/features/targets-and-alerts/types"
import { QUERY_KEYS } from "@/lib/query-keys"

/** Any `yyyy-MM-dd` (or legacy `yyyy-MM`) → API period month (1st UTC). */
function periodMonthParam(dateInput: string) {
  if (!dateInput) return undefined
  const [year, month] = dateInput.split("-")
  if (!year || !month) return undefined
  return `${year}-${month}-01T00:00:00.000Z`
}

export function useMarketingTargets(
  dateInput: string
): UseQueryResult<MarketingTarget[], Error> {
  const periodMonth = periodMonthParam(dateInput)
  const filterKey = { periodMonth: periodMonth ?? "all" }

  return useQuery({
    queryKey: QUERY_KEYS.targets.list(filterKey),
    queryFn: () => getMarketingTargetsAction(periodMonth),
  })
}
