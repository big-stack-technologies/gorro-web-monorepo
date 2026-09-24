"use server"

import { get } from "@gorro/api/client"
import type {
  AmlFlagsAnalytics,
  AmlFlagsAnalyticsApiEnvelope,
} from "@/features/transactions/types"
import { endpoints } from "@/lib/endpoints"

export async function getAmlFlagsAnalyticsAction(): Promise<AmlFlagsAnalytics> {
  const { data } = await get<AmlFlagsAnalyticsApiEnvelope>(
    endpoints.admin.amlFlags
  )
  return data.data
}
