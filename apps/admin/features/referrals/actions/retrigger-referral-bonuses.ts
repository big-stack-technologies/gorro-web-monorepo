"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function retriggerReferralBonusesAction(
  userId: string
): Promise<ActionResult<unknown>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.referralsRetrigger,
      {},
      { params: { userId } }
    )
    return { success: true, data }
  } catch (error) {
    console.error(
      `Retrigger referral bonuses action failed for ${userId}:`,
      error
    )
    return actionFailure(error, "Could not retrigger referral bonuses")
  }
}
