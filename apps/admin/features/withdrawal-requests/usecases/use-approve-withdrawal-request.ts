"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { approveWithdrawalRequestAction } from "@/features/withdrawal-requests/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useApproveWithdrawalRequest(withdrawalRequestId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () =>
      unwrapActionResult(
        await approveWithdrawalRequestAction(withdrawalRequestId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.withdrawalRequests.list,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.withdrawalRequests.detail(withdrawalRequestId),
      })
      toast.success("Withdrawal request approved")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Approve withdrawal request error:", error)
    },
  })
}
