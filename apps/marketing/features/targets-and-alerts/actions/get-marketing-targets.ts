"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingTarget } from "@/features/targets-and-alerts/types"

export async function getMarketingTargetsAction(
  periodMonth?: string
): Promise<MarketingTarget[]> {
  try {
    const params: Record<string, string> = {}
    if (periodMonth) params.periodMonth = periodMonth

    const { data } = await get<MarketingTarget[]>(endpoints.marketing.targets, {
      params,
    })
    return data
  } catch (error) {
    console.error("Failed to load marketing targets:", error)
    throw error
  }
}
