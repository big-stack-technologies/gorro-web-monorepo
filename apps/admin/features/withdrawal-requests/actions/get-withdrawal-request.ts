"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { WithdrawalRequest } from "@/features/withdrawal-requests/types"

export async function getWithdrawalRequestAction(
  id: string
): Promise<WithdrawalRequest> {
  const { data } = await get<WithdrawalRequest>(
    endpoints.admin.withdrawalRequestById(id)
  )
  return data
}
