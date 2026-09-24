"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateCgaAssignmentAction } from "@/features/cgas/actions"
import type { CgaAssignmentPayload } from "@/features/cgas/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateCgaAssignment(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CgaAssignmentPayload) =>
      unwrapActionResult(await updateCgaAssignmentAction(userId, payload)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cgas.all })
      toast.success("Assignment updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update CGA assignment error:", error)
    },
  })
}
