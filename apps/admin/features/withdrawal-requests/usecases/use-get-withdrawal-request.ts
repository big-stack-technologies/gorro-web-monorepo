"use client"

import { useQuery } from "@tanstack/react-query"

import { getWithdrawalRequestAction } from "@/features/withdrawal-requests/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useGetWithdrawalRequest(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.withdrawalRequests.detail(id),
    queryFn: () => getWithdrawalRequestAction(id),
  })
}
