"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getFinanceLiquidityAction } from "@/features/finance/actions"
import type { FinanceLiquidityResponse } from "@/features/finance/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFinanceLiquidity(): UseQueryResult<
  FinanceLiquidityResponse,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.finance.liquidity,
    queryFn: () => getFinanceLiquidityAction(),
  })
}
