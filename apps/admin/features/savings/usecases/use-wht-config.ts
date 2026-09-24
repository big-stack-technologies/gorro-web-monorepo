"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getWhtConfigAction } from "@/features/savings/actions"
import type { SavingsWhtConfig } from "@/features/savings/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useWhtConfig(): UseQueryResult<SavingsWhtConfig, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.savings.wht,
    queryFn: () => getWhtConfigAction(),
  })
}
