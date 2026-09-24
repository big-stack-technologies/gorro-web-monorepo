"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import type {
  CreateVirtualAccountPayload,
  CreateVirtualAccountResponse,
  CreateVirtualAccountResult,
} from "@/features/users/types"
import { endpoints } from "@/lib/endpoints"

export async function createUserVirtualAccountAction(
  userId: string,
  payload: CreateVirtualAccountPayload
): Promise<ActionResult<CreateVirtualAccountResult>> {
  try {
    const { data } = await post<CreateVirtualAccountResponse>(
      endpoints.admin.userVirtualAccountById(userId),
      payload
    )

    if (!data.success) {
      return {
        success: false,
        error: data.message || "Could not create virtual account",
      }
    }

    return {
      success: true,
      data: { account: data.data, message: data.message },
    }
  } catch (error) {
    console.error(
      `Create virtual account action failed for user ${userId}:`,
      error
    )
    return actionFailure(error, "Could not create virtual account")
  }
}
