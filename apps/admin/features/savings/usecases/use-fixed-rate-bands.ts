"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { listFixedRateBandsAction } from "@/features/savings/actions"
import type { SavingsFixedRateBand } from "@/features/savings/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFixedRateBands(): UseQueryResult<
  SavingsFixedRateBand[],
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.savings.fixedBands,
    queryFn: () => listFixedRateBandsAction(),
  })
}
