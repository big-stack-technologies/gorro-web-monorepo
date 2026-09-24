"use server"

import type {
  ClustersOverview,
  TopActivityParams,
  TopClusterByActivity,
  TopClusterByBalance,
  WithdrawalVolume,
  WithdrawalVolumeParams,
} from "@/features/clusters/types"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

function definedParams(
  values: Record<string, string | number | undefined>
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, string | number] =>
        entry[1] !== undefined && entry[1] !== ""
    )
  )
}

export async function getClustersOverviewAction(): Promise<ClustersOverview> {
  const { data } = await get<ClustersOverview>(
    endpoints.admin.clustersAnalyticsOverview
  )
  return data
}

export async function getTopClustersByBalanceAction(
  limit = 5
): Promise<TopClusterByBalance[]> {
  const { data } = await get<TopClusterByBalance[]>(
    endpoints.admin.clustersAnalyticsTopByBalance,
    { params: { limit } }
  )
  return data
}

export async function getTopClustersByActivityAction(
  params: TopActivityParams = {}
): Promise<TopClusterByActivity[]> {
  const { data } = await get<TopClusterByActivity[]>(
    endpoints.admin.clustersAnalyticsTopByActivity,
    { params: definedParams(params) }
  )
  return data
}

export async function getClusterWithdrawalVolumeAction(
  params: WithdrawalVolumeParams = {}
): Promise<WithdrawalVolume> {
  const { data } = await get<WithdrawalVolume>(
    endpoints.admin.clustersAnalyticsWithdrawalVolume,
    { params: definedParams(params) }
  )
  return data
}
