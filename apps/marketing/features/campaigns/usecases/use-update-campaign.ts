"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { updateCampaignAction } from "@/features/campaigns/actions"
import type { MarketingCampaignPayload } from "@/features/campaigns/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateCampaign(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<MarketingCampaignPayload>) =>
      unwrapActionResult(await updateCampaignAction(id, payload)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.campaigns.performance(id),
      })
      toast.success("Campaign updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update campaign error:", error)
    },
  })
}
