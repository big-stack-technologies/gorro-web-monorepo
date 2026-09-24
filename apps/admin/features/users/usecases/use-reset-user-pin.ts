"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { resetUserPinAction } from "@/features/users/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useResetUserPin(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () =>
      unwrapActionResult(await resetUserPinAction(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.list })
      toast.success("PIN reset — temporary PIN issued")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Reset user PIN error:", error)
    },
  })
}
