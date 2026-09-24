"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { setCgaTargetAction } from "@/features/cgas/actions"
import type { CgaTargetPayload } from "@/features/cgas/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useSetCgaTarget(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CgaTargetPayload) =>
      unwrapActionResult(await setCgaTargetAction(userId, payload)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cgas.all })
      toast.success("Target saved")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Set CGA target error:", error)
    },
  })
}
