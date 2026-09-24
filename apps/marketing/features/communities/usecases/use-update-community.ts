"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { updateCommunityAction } from "@/features/communities/actions"
import type { MarketingCommunityUpdatePayload } from "@/features/communities/types"
import { invalidateCommunities } from "@/features/communities/usecases/invalidate-communities"

export function useUpdateCommunity(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: MarketingCommunityUpdatePayload) =>
      unwrapActionResult(await updateCommunityAction(id, payload)),
    onSuccess: () => {
      invalidateCommunities(queryClient)
      toast.success("Community updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update community error:", error)
    },
  })
}
