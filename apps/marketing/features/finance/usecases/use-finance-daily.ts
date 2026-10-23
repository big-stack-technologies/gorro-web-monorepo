"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getFinanceDailyAction } from "@/features/finance/actions"
import type {
  FinancePeriodFilters,
  FinanceDailyResponse,
} from "@/features/finance/types"
import { filtersKey } from "@/features/finance/usecases/filters-key"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFinanceDaily(
  filters: FinancePeriodFilters
): UseQueryResult<FinanceDailyResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.finance.daily(filtersKey(filters)),
    queryFn: () => getFinanceDailyAction(filters),
  })
}
