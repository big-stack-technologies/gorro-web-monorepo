"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createUserVirtualAccountAction } from "@/features/users/actions"
import type {
  CreateVirtualAccountPayload,
  CreateVirtualAccountResult,
} from "@/features/users/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCreateUserVirtualAccount(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateVirtualAccountPayload) =>
      unwrapActionResult(
        await createUserVirtualAccountAction(userId, payload)
      ),
    onSuccess: (result: CreateVirtualAccountResult) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.users.detail(userId),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.wallet.main(userId),
      })
      toast.success(result.message)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Create virtual account error:", error)
    },
  })
}
