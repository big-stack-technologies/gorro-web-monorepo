"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getTransactionsVolumeAction } from "@/features/dashboard/actions"
import type { TransactionVolumePoint } from "@/features/dashboard/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useTransactionsVolume(): UseQueryResult<
  TransactionVolumePoint[],
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.transactionsVolume,
    queryFn: () => getTransactionsVolumeAction(),
  })
}
