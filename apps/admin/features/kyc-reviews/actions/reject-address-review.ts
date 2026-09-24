"use server"

import { post } from "@gorro/api/client"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import type {
  AddressReviewDecisionResponse,
  RejectAddressReviewPayload,
} from "@/features/kyc-reviews/types"
import { endpoints } from "@/lib/endpoints"

export async function rejectAddressReviewAction(
  id: string,
  payload: RejectAddressReviewPayload
): Promise<ActionResult<AddressReviewDecisionResponse>> {
  try {
    const { data } = await post<AddressReviewDecisionResponse>(
      endpoints.admin.kycAddressReviewRejectById(id),
      payload
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Reject address review action failed for ${id}:`, error)
    return actionFailure(error, "Could not reject address review")
  }
}
