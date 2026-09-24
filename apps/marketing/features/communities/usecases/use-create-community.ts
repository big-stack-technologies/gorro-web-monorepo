"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { createCommunityAction } from "@/features/communities/actions"
import type { MarketingCommunityPayload } from "@/features/communities/types"
import { invalidateCommunities } from "@/features/communities/usecases/invalidate-communities"

export function useCreateCommunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: MarketingCommunityPayload) =>
      unwrapActionResult(await createCommunityAction(payload)),
    onSuccess: () => {
      invalidateCommunities(queryClient)
      toast.success("Community created")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Create community error:", error)
    },
  })
}
