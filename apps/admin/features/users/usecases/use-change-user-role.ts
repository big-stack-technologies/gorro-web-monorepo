"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { changeUserRoleAction } from "@/features/users/actions"
import type { ChangeUserRoleFormValues } from "@/features/users/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

/**
 * POST role change; invalidates users cache and toasts on success.
 */
export function useChangeUserRole(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: ChangeUserRoleFormValues) =>
      unwrapActionResult(await changeUserRoleAction(userId, values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
      toast.success("Role updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Change user role error:", error)
    },
  })
}
