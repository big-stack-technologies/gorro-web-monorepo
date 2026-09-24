"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { reverseTransactionAction } from "@/features/transactions/actions"
import type { TransactionReasonPayload } from "@/features/transactions/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useReverseTransaction(transactionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TransactionReasonPayload) =>
      unwrapActionResult(
        await reverseTransactionAction(transactionId, payload)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.list })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.transactions.detail(transactionId),
      })
      toast.success("Transaction reversed")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Reverse transaction error:", error)
    },
  })
}
