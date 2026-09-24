"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { put } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { CgaAssignmentPayload } from "@/features/cgas/types"

export async function updateCgaAssignmentAction(
  userId: string,
  payload: CgaAssignmentPayload
): Promise<ActionResult<void>> {
  try {
    await put(endpoints.marketing.cgaAssignment(userId), payload)
    return { success: true, data: undefined }
  } catch (error) {
    console.error(`Update CGA assignment action failed for ${userId}:`, error)
    return actionFailure(error, "Could not update assignment")
  }
}
