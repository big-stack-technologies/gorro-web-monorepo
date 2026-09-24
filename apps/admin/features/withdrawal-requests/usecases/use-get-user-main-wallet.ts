"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getUserMainWalletAction } from "@/features/withdrawal-requests/actions"
import type { UserMainWallet } from "@/features/withdrawal-requests/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useGetUserMainWallet(
  userId: string,
  enabled: boolean
): UseQueryResult<UserMainWallet, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.main(userId),
    queryFn: () => getUserMainWalletAction(userId),
    enabled: enabled && userId.length > 0,
  })
}
