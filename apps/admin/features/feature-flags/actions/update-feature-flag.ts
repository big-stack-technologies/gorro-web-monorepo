"use server"

import type {
  FeatureFlag,
  UpdateFeatureFlagPayload,
} from "@/features/feature-flags/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { patch } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function updateFeatureFlagAction(
  key: string,
  payload: UpdateFeatureFlagPayload
): Promise<ActionResult<FeatureFlag>> {
  try {
    const { data } = await patch<FeatureFlag>(
      endpoints.admin.featureFlagByKey(key),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Update feature flag action failed for ${key}:`, error)
    return actionFailure(error, "Could not update feature flag")
  }
}
