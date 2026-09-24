"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { CgaTargetPayload, CgaTargetResponse } from "@/features/cgas/types"

export async function setCgaTargetAction(
  userId: string,
  payload: CgaTargetPayload
): Promise<ActionResult<CgaTargetResponse>> {
  try {
    const { data } = await post<CgaTargetResponse>(
      endpoints.marketing.cgaTargets(userId),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Set CGA target action failed for ${userId}:`, error)
    return actionFailure(error, "Could not save target")
  }
}
