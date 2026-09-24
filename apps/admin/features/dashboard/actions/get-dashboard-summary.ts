"use server"

import { get } from "@gorro/api/client"
import type {
  DashboardApiEnvelope,
  DashboardPeriod,
  DashboardSummary,
} from "@/features/dashboard/types"
import { endpoints } from "@/lib/endpoints"

export async function getDashboardSummaryAction(
  period: DashboardPeriod
): Promise<DashboardSummary> {
  const { data } = await get<DashboardApiEnvelope>(
    endpoints.admin.analyticsDashboard,
    {
      params: { period },
    }
  )
  return data.data
}
