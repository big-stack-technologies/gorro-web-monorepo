"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { runReengagementCampaignsAction } from "@/features/reengagement/actions"
import {
  getReengagementCampaignLabel,
  REENGAGEMENT_CAMPAIGNS,
} from "@/features/reengagement/constants"
import type { RunReengagementResponse } from "@/features/reengagement/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

function formatRunResults(response: RunReengagementResponse) {
  const parts = REENGAGEMENT_CAMPAIGNS.map((campaign) => {
    const count = response.results[campaign]
    if (count === undefined) return null
    const label = getReengagementCampaignLabel(campaign)
    if (count === -1) return `${label}: error`
    return `${label}: ${count.toLocaleString()}`
  }).filter(Boolean)

  return parts.length > 0 ? parts.join(" · ") : response.message
}

export function useRunReengagementCampaigns() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () =>
      unwrapActionResult(await runReengagementCampaignsAction()),
    onSuccess: (response) => {
      toast.success(formatRunResults(response))
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Run re-engagement campaigns error:", error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reengagement.all })
    },
  })
}
