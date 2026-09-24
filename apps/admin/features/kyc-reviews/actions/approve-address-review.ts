"use server"

import { post } from "@gorro/api/client"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import type { AddressReviewDecisionResponse } from "@/features/kyc-reviews/types"
import { endpoints } from "@/lib/endpoints"

export async function approveAddressReviewAction(
  id: string
): Promise<ActionResult<AddressReviewDecisionResponse>> {
  try {
    const { data } = await post<AddressReviewDecisionResponse>(
      endpoints.admin.kycAddressReviewApproveById(id),
      {}
    )
    return { success: true, data }
  } catch (error) {
    console.error(`Approve address review action failed for ${id}:`, error)
    return actionFailure(error, "Could not approve address review")
  }
}
