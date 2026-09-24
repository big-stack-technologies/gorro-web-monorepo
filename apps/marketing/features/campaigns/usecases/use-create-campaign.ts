"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { createCampaignAction } from "@/features/campaigns/actions"
import type { MarketingCampaignPayload } from "@/features/campaigns/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: MarketingCampaignPayload) =>
      unwrapActionResult(await createCampaignAction(payload)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all })
      toast.success("Campaign created")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Create campaign error:", error)
    },
  })
}
