"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { linkCommunityMembersAction } from "@/features/communities/actions"
import type {
  CommunityMemberSkippedItem,
  LinkCommunityMembersPayload,
  LinkCommunityMembersResponse,
} from "@/features/communities/types"
import { invalidateCommunities } from "@/features/communities/usecases/invalidate-communities"

function normalizeSkipped(
  raw: LinkCommunityMembersResponse["skipped"] | undefined
): CommunityMemberSkippedItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    if (typeof item === "string") return item
    if (item && typeof item === "object" && "userId" in item) {
      return item
    }
    return String(item)
  })
}

export type LinkMembersResult = {
  added: number
  message: string
  skipped: CommunityMemberSkippedItem[]
}

export function useLinkCommunityMembers(communityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      payload: LinkCommunityMembersPayload
    ): Promise<LinkMembersResult> => {
      const response = unwrapActionResult(
        await linkCommunityMembersAction(communityId, payload)
      )
      return {
        added: response.added ?? 0,
        message: response.message?.trim() || "Members linked.",
        skipped: normalizeSkipped(response.skipped),
      }
    },
    onSuccess: (result) => {
      invalidateCommunities(queryClient)
      if (result.skipped.length > 0) {
        toast.warning(result.message)
      } else {
        toast.success(result.message)
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Link community members error:", error)
    },
  })
}
