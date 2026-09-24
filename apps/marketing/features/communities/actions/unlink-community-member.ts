"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { del } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

export async function unlinkCommunityMemberAction(
  communityId: string,
  userId: string
): Promise<ActionResult<void>> {
  try {
    await del(endpoints.marketing.communityMember(communityId, userId))
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Unlink community member action failed:", error)
    return actionFailure(error, "Could not unlink member")
  }
}
