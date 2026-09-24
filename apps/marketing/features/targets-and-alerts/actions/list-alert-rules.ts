"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingAlertRule } from "@/features/targets-and-alerts/types"

export async function listAlertRulesAction(): Promise<MarketingAlertRule[]> {
  try {
    const { data } = await get<MarketingAlertRule[]>(
      endpoints.marketing.alertRules
    )
    return data
  } catch (error) {
    console.error("Failed to load marketing alert rules:", error)
    throw error
  }
}
