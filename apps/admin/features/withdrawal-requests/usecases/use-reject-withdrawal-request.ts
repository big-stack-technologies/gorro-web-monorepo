"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rejectWithdrawalRequestAction } from "@/features/withdrawal-requests/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useRejectWithdrawalRequest(withdrawalRequestId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () =>
      unwrapActionResult(
        await rejectWithdrawalRequestAction(withdrawalRequestId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.withdrawalRequests.list,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.withdrawalRequests.detail(withdrawalRequestId),
      })
      toast.success("Withdrawal request rejected")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Reject withdrawal request error:", error)
    },
  })
}
