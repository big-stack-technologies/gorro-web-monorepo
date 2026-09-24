"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { closeAjoGroupAction } from "@/features/ajo/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCloseAjoGroup(groupId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () =>
      unwrapActionResult(await closeAjoGroupAction(groupId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ajo.groups.list })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ajo.groups.detail(groupId),
      })
      toast.success("Ajo group closed")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Close Ajo group error:", error)
    },
  })
}
