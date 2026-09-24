"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getTransactionAction } from "@/features/transactions/actions"
import type { TransactionDetail } from "@/features/transactions/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useGetTransaction(
  transactionId: string,
  enabled: boolean
): UseQueryResult<TransactionDetail, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.detail(transactionId),
    queryFn: () => getTransactionAction(transactionId),
    enabled: enabled && Boolean(transactionId),
  })
}
