"use server"

import { get } from "@gorro/api/client"
import type {
  ReengagementAudiencesQuery,
  ReengagementAudiencesResponse,
} from "@/features/reengagement/types"
import { endpoints } from "@/lib/endpoints"

export async function getReengagementAudiencesAction(
  query: ReengagementAudiencesQuery = {}
): Promise<ReengagementAudiencesResponse> {
  const params: Record<string, number> = {}

  if (query.balanceBelow != null && Number.isFinite(query.balanceBelow)) {
    params.balanceBelow = query.balanceBelow
  }

  const { data } = await get<ReengagementAudiencesResponse>(
    endpoints.admin.reengagementAudiences,
    Object.keys(params).length > 0 ? { params } : undefined
  )
  return data
}
