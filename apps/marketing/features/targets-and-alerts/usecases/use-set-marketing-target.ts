"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { setMarketingTargetAction } from "@/features/targets-and-alerts/actions"
import type { MarketingTargetPayload } from "@/features/targets-and-alerts/types"
import { invalidateTargetsRelatedQueries } from "@/features/targets-and-alerts/usecases/invalidate-overview"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

export function useSetMarketingTarget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: MarketingTargetPayload) =>
      unwrapActionResult(await setMarketingTargetAction(payload)),
    onSuccess: () => {
      invalidateTargetsRelatedQueries(queryClient)
      toast.success("Target saved")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Set marketing target error:", error)
    },
  })
}
