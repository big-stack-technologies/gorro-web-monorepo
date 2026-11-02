"use server"

import type {
  CircleFunnel,
  CircleFunnelParams,
  CircleGrowth,
  CircleGrowthParams,
  CirclesOverview,
} from "@/features/circles/types"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

function definedParams(
  values: Record<string, string | undefined>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, string] =>
        entry[1] !== undefined && entry[1] !== ""
    )
  )
}

export async function getCirclesOverviewAction(): Promise<CirclesOverview> {
  const { data } = await get<CirclesOverview>(
    endpoints.admin.circlesAnalyticsOverview
  )
  return data
}

export async function getCircleFunnelAction(
  params: CircleFunnelParams = {}
): Promise<CircleFunnel> {
  const { data } = await get<CircleFunnel>(
    endpoints.admin.circlesAnalyticsFunnel,
    { params: definedParams(params) }
  )
  return data
}

export async function getCircleGrowthAction(
  params: CircleGrowthParams = {}
): Promise<CircleGrowth> {
  const { data } = await get<CircleGrowth>(
    endpoints.admin.circlesAnalyticsGrowth,
    { params: definedParams(params) }
  )
  return data
}
