"use server"

import type { AjoConfig, UpdateAjoConfigPayload } from "@/features/ajo/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function updateAjoConfigAction(
  payload: UpdateAjoConfigPayload
): Promise<ActionResult<AjoConfig>> {
  try {
    const { data } = await patch<AjoConfig>(endpoints.admin.ajoConfig, payload)
    return { success: true, data }
  } catch (error) {
    console.error("Update Ajo config action failed:", error)
    return actionFailure(error, "Could not update Ajo settings")
  }
}
