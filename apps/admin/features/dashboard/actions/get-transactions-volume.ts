"use server"

import { get } from "@gorro/api/client"
import type {
  TransactionVolumePoint,
  TransactionsVolumeApiEnvelope,
} from "@/features/dashboard/types"
import { endpoints } from "@/lib/endpoints"

export async function getTransactionsVolumeAction(): Promise<
  TransactionVolumePoint[]
> {
  const { data } = await get<TransactionsVolumeApiEnvelope>(
    endpoints.admin.transactionsVolume
  )
  return data.data
}
