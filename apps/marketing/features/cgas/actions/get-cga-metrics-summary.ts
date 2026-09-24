"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  CgaMetricsFilters,
  CgaMetricsSummaryResponse,
} from "@/features/cgas/types"

function buildParams(filters: CgaMetricsFilters) {
  const params: Record<string, string> = {}
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  if (filters.email) params.email = filters.email
  if (filters.phone) params.phone = filters.phone
  return params
}

export async function getCgaMetricsSummaryAction(
  filters: CgaMetricsFilters = {}
): Promise<CgaMetricsSummaryResponse> {
  try {
    const { data } = await get<CgaMetricsSummaryResponse>(
      endpoints.cga.metricsSummary,
      { params: buildParams(filters) }
    )
    return data
  } catch (error) {
    console.error("Failed to load CGA metrics summary:", error)
    throw error
  }
}
