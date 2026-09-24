"use server"

import type {
  ReengagementConfig,
  UpdateReengagementConfigPayload,
} from "@/features/reengagement/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function updateReengagementConfigAction(
  payload: UpdateReengagementConfigPayload
): Promise<ActionResult<ReengagementConfig>> {
  try {
    const { data } = await patch<ReengagementConfig>(
      endpoints.admin.reengagementConfig,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Update re-engagement config action failed:", error)
    return actionFailure(error, "Could not update re-engagement settings")
  }
}
