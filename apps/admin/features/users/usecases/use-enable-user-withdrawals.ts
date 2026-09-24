"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { enableUserWithdrawalsAction } from "@/features/users/actions"
import type { WithdrawalsReasonFormValues } from "@/features/users/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useEnableUserWithdrawals(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: WithdrawalsReasonFormValues) =>
      unwrapActionResult(
        await enableUserWithdrawalsAction(userId, values)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.list })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.users.detail(userId),
      })
      toast.success("Withdrawals enabled")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Enable user withdrawals error:", error)
    },
  })
}
