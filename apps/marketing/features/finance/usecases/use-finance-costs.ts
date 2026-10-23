"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getFinanceCostsAction } from "@/features/finance/actions"
import type {
  FinancePeriodFilters,
  FinanceCostsResponse,
} from "@/features/finance/types"
import { filtersKey } from "@/features/finance/usecases/filters-key"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFinanceCosts(
  filters: FinancePeriodFilters
): UseQueryResult<FinanceCostsResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.finance.costs(filtersKey(filters)),
    queryFn: () => getFinanceCostsAction(filters),
  })
}
