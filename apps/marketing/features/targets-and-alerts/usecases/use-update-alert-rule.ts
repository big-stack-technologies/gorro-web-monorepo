"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateAlertRuleAction } from "@/features/targets-and-alerts/actions"
import type { UpdateMarketingAlertRulePayload } from "@/features/targets-and-alerts/types"
import { invalidateTargetsRelatedQueries } from "@/features/targets-and-alerts/usecases/invalidate-overview"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

export function useUpdateAlertRule(code: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateMarketingAlertRulePayload) =>
      unwrapActionResult(await updateAlertRuleAction(code, payload)),
    onSuccess: () => {
      invalidateTargetsRelatedQueries(queryClient)
      toast.success("Alert rule updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error(`Update alert rule error (${code}):`, error)
    },
  })
}
