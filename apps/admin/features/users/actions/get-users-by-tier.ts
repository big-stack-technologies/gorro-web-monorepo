"use server"

import { get } from "@gorro/api/client"
import type {
  UserKycTierBreakdown,
  UsersByTierApiEnvelope,
} from "@/features/users/types"
import { endpoints } from "@/lib/endpoints"

export async function getUsersByTierAction(): Promise<UserKycTierBreakdown[]> {
  const { data } = await get<UsersByTierApiEnvelope>(
    endpoints.admin.usersByTier
  )
  return data.data
}
