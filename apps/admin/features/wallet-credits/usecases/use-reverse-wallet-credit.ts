"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { reverseTransactionAction } from "@/features/transactions/actions"
import type { TransactionReasonPayload } from "@/features/transactions/schema"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { unwrapActionResult } from "@gorro/api/action-result"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useReverseWalletCredit(transactionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: TransactionReasonPayload) =>
      unwrapActionResult(await reverseTransactionAction(transactionId, payload)),
    onSuccess: () => {
      toast.success("Credit reversed")
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.walletCredits.all,
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.transactions.all,
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error(`Reverse wallet credit error (${transactionId}):`, error)
    },
  })
}
