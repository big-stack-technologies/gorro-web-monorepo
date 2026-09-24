"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getTransactionsAnalyticsSummaryAction } from "@/features/transactions/actions"
import type { TransactionsAnalyticsSummary } from "@/features/transactions/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useTransactionsAnalyticsSummary(): UseQueryResult<
  TransactionsAnalyticsSummary,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.analyticsSummary,
    queryFn: () => getTransactionsAnalyticsSummaryAction(),
  })
}
