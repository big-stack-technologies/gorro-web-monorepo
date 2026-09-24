"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { disableUserWithdrawalsAction } from "@/features/users/actions"
import type { WithdrawalsReasonFormValues } from "@/features/users/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useDisableUserWithdrawals(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: WithdrawalsReasonFormValues) =>
      unwrapActionResult(
        await disableUserWithdrawalsAction(userId, values)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.list })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.users.detail(userId),
      })
      toast.success("Withdrawals disabled")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Disable user withdrawals error:", error)
    },
  })
}
