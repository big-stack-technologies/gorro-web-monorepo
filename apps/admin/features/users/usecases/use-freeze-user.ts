"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { freezeUserAction } from "@/features/users/actions"
import type { FreezeUserFormValues } from "@/features/users/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFreezeUser(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: FreezeUserFormValues) =>
      unwrapActionResult(await freezeUserAction(userId, values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.list })
      toast.success("Account frozen")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Freeze user error:", error)
    },
  })
}
