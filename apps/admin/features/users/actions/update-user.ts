"use server"

import type { UpdateUserPayload } from "@/features/users/schema"
import type { User } from "@/features/users/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function updateUserAction(
  id: string,
  payload: UpdateUserPayload
): Promise<ActionResult<User>> {
  try {
    const { data } = await patch<User>(endpoints.admin.userById(id), payload)
    return { success: true, data }
  } catch (error) {
    console.error(`Update user action failed for ${id}:`, error)
    return actionFailure(error, "Could not update user")
  }
}
