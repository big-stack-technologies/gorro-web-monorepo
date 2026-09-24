"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingAlerts } from "@/features/overview/types"

export async function getMarketingAlertsAction(): Promise<MarketingAlerts> {
  try {
    const { data } = await get<MarketingAlerts>(endpoints.marketing.alerts)
    return data
  } catch (error) {
    console.error("Failed to load marketing alerts:", error)
    throw error
  }
}
