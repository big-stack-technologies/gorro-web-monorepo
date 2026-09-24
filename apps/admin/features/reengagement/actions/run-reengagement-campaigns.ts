"use server"

import type { RunReengagementResponse } from "@/features/reengagement/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function runReengagementCampaignsAction(): Promise<
  ActionResult<RunReengagementResponse>
> {
  try {
    const { data } = await post<RunReengagementResponse>(
      endpoints.admin.reengagementRun
    )
    return { success: true, data }
  } catch (error) {
    console.error("Run re-engagement campaigns action failed:", error)
    return actionFailure(error, "Could not run re-engagement campaigns")
  }
}
