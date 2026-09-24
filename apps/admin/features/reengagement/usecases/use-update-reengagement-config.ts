"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateReengagementConfigAction } from "@/features/reengagement/actions"
import type { UpdateReengagementConfigPayload } from "@/features/reengagement/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateReengagementConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateReengagementConfigPayload) =>
      unwrapActionResult(await updateReengagementConfigAction(payload)),
    onSuccess: () => {
      toast.success("Re-engagement settings updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update re-engagement config error:", error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reengagement.all })
    },
  })
}
