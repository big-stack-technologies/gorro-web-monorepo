"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getCircleFunnelAction,
  getCircleGrowthAction,
  getCirclesOverviewAction,
} from "@/features/circles/actions"
import type {
  CircleFunnelParams,
  CircleGrowthParams,
} from "@/features/circles/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCirclesOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.circles.analytics.overview,
    queryFn: getCirclesOverviewAction,
  })
}

export function useCircleFunnel(params: CircleFunnelParams) {
  const filters = {
    from: params.from ?? "",
    to: params.to ?? "",
  }
  return useQuery({
    queryKey: QUERY_KEYS.circles.analytics.funnel(filters),
    queryFn: () => getCircleFunnelAction(params),
  })
}

export function useCircleGrowth(params: CircleGrowthParams) {
  const filters = {
    from: params.from ?? "",
    to: params.to ?? "",
    groupBy: params.groupBy ?? "month",
  }
  return useQuery({
    queryKey: QUERY_KEYS.circles.analytics.growth(filters),
    queryFn: () => getCircleGrowthAction(params),
  })
}
