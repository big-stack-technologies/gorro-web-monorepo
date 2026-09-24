"use server"

import { get } from "@gorro/api/client"

import { buildOrgPerformanceParams } from "@/features/org/actions/build-performance-params"
import type {
  OrgPerformanceFilters,
  TerritoriesPerformanceResponse,
} from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function getTerritoriesPerformanceAction(
  filters: OrgPerformanceFilters
): Promise<TerritoriesPerformanceResponse> {
  try {
    const { data } = await get<TerritoriesPerformanceResponse>(
      endpoints.marketing.territoriesPerformance,
      { params: buildOrgPerformanceParams(filters) }
    )
    return data
  } catch (error) {
    console.error("Failed to load territory performance:", error)
    throw error
  }
}
