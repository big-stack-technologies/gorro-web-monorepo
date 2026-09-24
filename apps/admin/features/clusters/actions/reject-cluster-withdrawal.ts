"use server"

import type { RejectClusterWithdrawalPayload } from "@/features/clusters/schema"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function rejectClusterWithdrawalAction(
  clusterId: string,
  requestId: string,
  payload: RejectClusterWithdrawalPayload
): Promise<ActionResult<void>> {
  try {
    await post(
      endpoints.admin.clusterWithdrawalForceRejectById(clusterId, requestId),
      payload
    )
    return { success: true, data: undefined }
  } catch (error) {
    console.error(
      `Reject cluster withdrawal action failed for cluster ${clusterId}, request ${requestId}:`,
      error
    )
    return actionFailure(error, "Could not reject withdrawal")
  }
}
