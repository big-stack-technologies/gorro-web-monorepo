"use server"

import type { ChangeUserRolePayload } from "@/features/users/schema"
import type { User } from "@/features/users/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function changeUserRoleAction(
  id: string,
  payload: ChangeUserRolePayload
): Promise<ActionResult<User>> {
  try {
    const { data } = await post<User>(
      endpoints.admin.userRoleById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Change user role action failed for ${id}:`, error)
    return actionFailure(error, "Could not change user role")
  }
}
