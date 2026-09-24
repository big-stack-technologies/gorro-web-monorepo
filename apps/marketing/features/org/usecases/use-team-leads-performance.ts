"use client"

import { useQuery } from "@tanstack/react-query"

import { getTeamLeadsPerformanceAction } from "@/features/org/actions"
import type { OrgPerformanceFilters } from "@/features/org/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: OrgPerformanceFilters) {
  return {
    from: filters.from ?? "",
    to: filters.to ?? "",
    product: filters.product ?? "",
  }
}

export function useTeamLeadsPerformance(filters: OrgPerformanceFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.org.teamLeadsPerformance(filtersKey(filters)),
    queryFn: () => getTeamLeadsPerformanceAction(filters),
  })
}
