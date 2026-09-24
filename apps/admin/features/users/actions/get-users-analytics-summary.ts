"use server"

import { get } from "@gorro/api/client"
import type { UsersAnalyticsSummary } from "@/features/users/types"
import { endpoints } from "@/lib/endpoints"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"

export async function getUsersAnalyticsSummaryAction(): Promise<UsersAnalyticsSummary> {
  const { data } = await get<AnalyticsApiEnvelope<UsersAnalyticsSummary>>(
    endpoints.admin.usersAnalyticsSummary
  )
  return data.data
}
