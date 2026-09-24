"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateUserAction } from "@/features/users/actions"
import type { UpdateUserFormValues } from "@/features/users/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

/**
 * Updates a user via server action; invalidates list + detail queries and toasts on success.
 */
export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: UpdateUserFormValues) =>
      unwrapActionResult(await updateUserAction(userId, values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.list })
      toast.success("User updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update user error:", error)
    },
  })
}
