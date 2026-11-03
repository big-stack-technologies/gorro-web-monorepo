"use server"

import { get } from "@gorro/api/client"

import { formatDateParam } from "@gorro/api/format-date-param"
import { endpoints } from "@/lib/endpoints"

import type {
  CgaPerformanceFilters,
  CgaPerformanceResponse,
} from "@/features/cgas/types"

export async function getCgaPerformanceAction(
  filters: CgaPerformanceFilters
): Promise<CgaPerformanceResponse> {
  try {
    const params: Record<string, string> = {}
    if (filters.territoryId) params.territoryId = filters.territoryId
    if (filters.from) params.from = formatDateParam(filters.from)
    if (filters.to) params.to = formatDateParam(filters.to)
    if (filters.product) params.product = filters.product

    const { data } = await get<CgaPerformanceResponse>(
      endpoints.marketing.cgasPerformance,
      { params }
    )
    console.log("CGA performance data:", data)
    return data
  } catch (error) {
    console.error("Failed to load CGA performance:", error)
    throw error
  }
}
