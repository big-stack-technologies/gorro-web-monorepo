"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import type {
  LinkCommunityMembersPayload,
  LinkCommunityMembersResponse,
} from "@/features/communities/types"
import { endpoints } from "@/lib/endpoints"

export async function linkCommunityMembersAction(
  communityId: string,
  payload: LinkCommunityMembersPayload
): Promise<ActionResult<LinkCommunityMembersResponse>> {
  try {
    const { data } = await post<LinkCommunityMembersResponse>(
      endpoints.marketing.communityMembers(communityId),
      payload
    )
    return { success: true, data: data ?? {} }
  } catch (error) {
    console.error("Link community members action failed:", error)
    return actionFailure(error, "Could not link members")
  }
}
