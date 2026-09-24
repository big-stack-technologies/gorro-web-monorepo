"use server"

import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import type { AjoGroup, CreateAjoGroupPayload } from "@/features/ajo/types"

export async function createAjoGroupAction(
  payload: CreateAjoGroupPayload
): Promise<ActionResult<AjoGroup>> {
  try {
    const { data } = await post<AjoGroup>(endpoints.admin.ajoGroups, payload)
    return { success: true, data }
  } catch (error) {
    console.error("Create Ajo group action failed:", error)
    return actionFailure(error, "Could not create Ajo group")
  }
}
