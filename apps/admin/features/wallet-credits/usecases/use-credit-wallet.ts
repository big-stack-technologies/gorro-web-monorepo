"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { creditWalletAction } from "@/features/wallet-credits/actions"
import type { CreditWalletPayload } from "@/features/wallet-credits/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCreditWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreditWalletPayload) =>
      unwrapActionResult(await creditWalletAction(payload)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.walletCredits.all,
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Credit wallet error:", error)
    },
  })
}
