"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { listSavingsRatesAction } from "@/features/savings/actions"
import type { SavingsRateConfig } from "@/features/savings/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useSavingsRates(): UseQueryResult<SavingsRateConfig[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.savings.rates,
    queryFn: () => listSavingsRatesAction(),
  })
}
