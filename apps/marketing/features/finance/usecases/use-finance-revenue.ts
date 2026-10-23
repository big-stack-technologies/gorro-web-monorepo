"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getFinanceRevenueAction } from "@/features/finance/actions"
import type {
  FinancePeriodFilters,
  FinanceRevenueResponse,
} from "@/features/finance/types"
import { filtersKey } from "@/features/finance/usecases/filters-key"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFinanceRevenue(
  filters: FinancePeriodFilters
): UseQueryResult<FinanceRevenueResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.finance.revenue(filtersKey(filters)),
    queryFn: () => getFinanceRevenueAction(filters),
  })
}
