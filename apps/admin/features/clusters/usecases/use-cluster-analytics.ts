"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getClustersOverviewAction,
  getClusterWithdrawalVolumeAction,
  getTopClustersByActivityAction,
  getTopClustersByBalanceAction,
} from "@/features/clusters/actions"
import type {
  TopActivityParams,
  WithdrawalVolumeParams,
} from "@/features/clusters/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useClustersOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.clusters.analytics.overview,
    queryFn: getClustersOverviewAction,
  })
}

export function useTopClustersByBalance(limit = 5) {
  return useQuery({
    queryKey: QUERY_KEYS.clusters.analytics.topByBalance(limit),
    queryFn: () => getTopClustersByBalanceAction(limit),
  })
}

export function useTopClustersByActivity(params: TopActivityParams) {
  const filters = {
    limit: params.limit ?? 5,
    from: params.from ?? "",
    to: params.to ?? "",
  }
  return useQuery({
    queryKey: QUERY_KEYS.clusters.analytics.topByActivity(filters),
    queryFn: () => getTopClustersByActivityAction(params),
  })
}

export function useClusterWithdrawalVolume(params: WithdrawalVolumeParams) {
  const filters = {
    from: params.from ?? "",
    to: params.to ?? "",
    groupBy: params.groupBy ?? "day",
  }
  return useQuery({
    queryKey: QUERY_KEYS.clusters.analytics.withdrawalVolume(filters),
    queryFn: () => getClusterWithdrawalVolumeAction(params),
  })
}
