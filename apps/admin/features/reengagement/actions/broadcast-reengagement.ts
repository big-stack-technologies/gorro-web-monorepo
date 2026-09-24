"use server"

import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import type {
  BroadcastReengagementPayload,
  BroadcastReengagementResponse,
} from "@/features/reengagement/types"

export async function broadcastReengagementAction(
  payload: BroadcastReengagementPayload
): Promise<ActionResult<BroadcastReengagementResponse>> {
  try {
    const { data } = await post<BroadcastReengagementResponse>(
      endpoints.admin.reengagementBroadcast,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Broadcast re-engagement action failed:", error)
    return actionFailure(error, "Could not send push broadcast")
  }
}
