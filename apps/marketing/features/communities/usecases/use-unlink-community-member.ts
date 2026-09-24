"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { unlinkCommunityMemberAction } from "@/features/communities/actions"
import { invalidateCommunities } from "@/features/communities/usecases/invalidate-communities"

export function useUnlinkCommunityMember(communityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) =>
      unwrapActionResult(
        await unlinkCommunityMemberAction(communityId, userId)
      ),
    onSuccess: () => {
      invalidateCommunities(queryClient)
      toast.success("Member unlinked")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Unlink community member error:", error)
    },
  })
}
