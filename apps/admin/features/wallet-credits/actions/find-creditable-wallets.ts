"use server"

import { get } from "@gorro/api/client"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"
import type { CreditableWallet } from "@/features/wallet-credits/types"
import { endpoints } from "@/lib/endpoints"

export type FindCreditableWalletsParams =
  | { userId: string; accountNumber?: never }
  | { accountNumber: string; userId?: never }

export async function findCreditableWalletsAction(
  params: FindCreditableWalletsParams
): Promise<CreditableWallet[]> {
  try {
    const query: Record<string, string> =
      "userId" in params
        ? { userId: params.userId as string }
        : { accountNumber: params.accountNumber }

    const { data } = await get<AnalyticsApiEnvelope<CreditableWallet[]>>(
      endpoints.admin.walletCreditsWallets,
      { params: query }
    )
    return data.data ?? []
  } catch (error) {
    console.error("Failed to find creditable wallets:", error)
    throw error
  }
}
