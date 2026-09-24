"use server"

import { get } from "@gorro/api/client"
import type { UserReferralDetails } from "@/features/referrals/types"
import { endpoints } from "@/lib/endpoints"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"

export async function getUserReferralDetailsAction(
  userId: string
): Promise<UserReferralDetails> {
  const { data } = await get<AnalyticsApiEnvelope<UserReferralDetails>>(
    endpoints.admin.referralByUserId(userId)
  )
  return data.data
}
