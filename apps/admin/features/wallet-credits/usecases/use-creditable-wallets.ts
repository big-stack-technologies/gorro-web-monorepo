"use client"

import { useQuery } from "@tanstack/react-query"

import {
  findCreditableWalletsAction,
  type FindCreditableWalletsParams,
} from "@/features/wallet-credits/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

function paramsKey(params: FindCreditableWalletsParams | null): Record<string, string> {
  if (!params) return { disabled: "true" }
  return "userId" in params
    ? { userId: params.userId as string }
    : { accountNumber: params.accountNumber }
}

export function useCreditableWallets(params: FindCreditableWalletsParams | null) {
  const key = paramsKey(params)
  return useQuery({
    queryKey: QUERY_KEYS.walletCredits.wallets(key),
    queryFn: () => findCreditableWalletsAction(params!),
    enabled: params != null,
  })
}
