"use server"

import type { AjoGroupDetail } from "@/features/ajo/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function closeAjoGroupAction(
  id: string
): Promise<ActionResult<AjoGroupDetail>> {
  try {
    const { data } = await post<AjoGroupDetail>(
      endpoints.admin.ajoGroupClose(id),
      {}
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Close Ajo group action failed for ${id}:`, error)
    return actionFailure(error, "Could not close Ajo group")
  }
}
