"use server"

import { get } from "@gorro/api/client"
import type { AddressReviewDetail } from "@/features/kyc-reviews/types"
import { endpoints } from "@/lib/endpoints"

export async function getAddressReviewAction(
  id: string
): Promise<AddressReviewDetail> {
  const { data } = await get<AddressReviewDetail>(
    endpoints.admin.kycAddressReviewById(id)
  )
  return data
}
