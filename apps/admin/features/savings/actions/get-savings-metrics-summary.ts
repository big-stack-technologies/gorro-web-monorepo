"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type {
  SavingsMetricsSummary,
  SavingsMetricsSummaryParams,
} from "@/features/savings/types"

function buildMetricsSummaryParams(
  params?: SavingsMetricsSummaryParams
): Record<string, string> | undefined {
  if (!params) return undefined
  const query: Record<string, string> = {}
  if (params.product?.trim()) {
    query.product = params.product.trim()
  }
  if (params.from?.trim()) {
    query.from = params.from.trim()
  }
  if (params.to?.trim()) {
    query.to = params.to.trim()
  }
  return Object.keys(query).length > 0 ? query : undefined
}

export async function getSavingsMetricsSummaryAction(
  params?: SavingsMetricsSummaryParams
): Promise<SavingsMetricsSummary> {
  const { data } = await get<SavingsMetricsSummary>(
    endpoints.admin.savingsMetricsSummary,
    { params: buildMetricsSummaryParams(params) }
  )
  return data
}
