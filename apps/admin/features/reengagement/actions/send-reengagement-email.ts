"use server"

import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import type {
  SendReengagementEmailPayload,
  SendReengagementEmailResponse,
} from "@/features/reengagement/types"

export async function sendReengagementEmailAction(
  payload: SendReengagementEmailPayload
): Promise<ActionResult<SendReengagementEmailResponse>> {
  try {
    const { data } = await post<SendReengagementEmailResponse>(
      endpoints.admin.reengagementEmail,
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error("Send re-engagement email action failed:", error)
    return actionFailure(error, "Could not send email")
  }
}
