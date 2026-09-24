"use server"

import type { UpdateClusterPayload } from "@/features/clusters/schema"
import type { ClusterDetail } from "@/features/clusters/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function updateClusterAction(
  id: string,
  payload: UpdateClusterPayload
): Promise<ActionResult<ClusterDetail>> {
  try {
    const { data } = await patch<ClusterDetail>(
      endpoints.admin.clusterById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Update cluster action failed for ${id}:`, error)
    return actionFailure(error, "Could not update cluster")
  }
}
