"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  CgaMetricsTrendsResponse,
  CgaTrendsFilters,
} from "@/features/cgas/types"

function buildParams(filters: CgaTrendsFilters) {
  const params: Record<string, string> = {}
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  if (filters.email) params.email = filters.email
  if (filters.phone) params.phone = filters.phone
  if (filters.interval) params.interval = filters.interval
  return params
}

export async function getCgaMetricsTrendsAction(
  filters: CgaTrendsFilters = {}
): Promise<CgaMetricsTrendsResponse> {
  try {
    const { data } = await get<CgaMetricsTrendsResponse>(
      endpoints.cga.metricsTrends,
      { params: buildParams(filters) }
    )
    return data
  } catch (error) {
    console.error("Failed to load CGA metrics trends:", error)
    throw error
  }
}
