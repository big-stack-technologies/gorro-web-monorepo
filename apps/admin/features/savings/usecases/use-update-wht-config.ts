"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateWhtConfigAction } from "@/features/savings/actions"
import type { UpdateWhtConfigPayload } from "@/features/savings/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateWhtConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateWhtConfigPayload) =>
      unwrapActionResult(await updateWhtConfigAction(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savings.wht })
      toast.success("WHT config updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update WHT config error:", error)
    },
  })
}
