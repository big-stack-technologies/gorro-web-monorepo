"use server"

import type { FreezeUserPayload } from "@/features/users/schema"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function freezeUserAction(
  id: string,
  payload: FreezeUserPayload
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.userFreezeById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Freeze user action failed for ${id}:`, error)
    return actionFailure(error, "Could not freeze account")
  }
}
