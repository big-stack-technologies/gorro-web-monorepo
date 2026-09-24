"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { TransactionDetail } from "@/features/transactions/types"

export async function getTransactionAction(
  id: string
): Promise<TransactionDetail> {
  const { data } = await get<TransactionDetail>(endpoints.admin.transactionById(id))
  return data
}
