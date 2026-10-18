"use client"

import { useQuery } from "@tanstack/react-query"

import { getFieldReportComparisonAction } from "@/features/cgas/actions"
import type { FieldReportComparisonFilters } from "@/features/cgas/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: FieldReportComparisonFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>
}

export function useFieldReportComparison(filters: FieldReportComparisonFilters) {
  const key = filtersKey(filters)
  return useQuery({
    queryKey: QUERY_KEYS.cgas.fieldReportComparison(key),
    queryFn: () => getFieldReportComparisonAction(filters),
  })
}
