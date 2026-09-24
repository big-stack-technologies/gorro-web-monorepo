"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateAjoConfigAction } from "@/features/ajo/actions"
import type { UpdateAjoConfigPayload } from "@/features/ajo/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateAjoConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateAjoConfigPayload) =>
      unwrapActionResult(await updateAjoConfigAction(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ajo.all })
      toast.success("Ajo settings updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update Ajo config error:", error)
    },
  })
}
