"use server"

import { get } from "@gorro/api/client"

import { buildOrgPerformanceParams } from "@/features/org/actions/build-performance-params"
import type {
  OrgPerformanceFilters,
  TeamLeadsPerformanceResponse,
} from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function getTeamLeadsPerformanceAction(
  filters: OrgPerformanceFilters
): Promise<TeamLeadsPerformanceResponse> {
  try {
    const { data } = await get<TeamLeadsPerformanceResponse>(
      endpoints.marketing.teamLeadsPerformance,
      { params: buildOrgPerformanceParams(filters) }
    )
    return data
  } catch (error) {
    console.error("Failed to load team lead performance:", error)
    throw error
  }
}
