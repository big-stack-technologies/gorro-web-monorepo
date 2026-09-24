"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { del } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function removeClusterMemberAction(
  clusterId: string,
  userId: string
): Promise<ActionResult<void>> {
  try {
    await del(endpoints.admin.clusterMemberByUserId(clusterId, userId))
    return { success: true, data: undefined }
  } catch (error) {
    console.error(
      `Remove cluster member action failed for cluster ${clusterId}, user ${userId}:`,
      error
    )
    return actionFailure(error, "Could not remove member")
  }
}
