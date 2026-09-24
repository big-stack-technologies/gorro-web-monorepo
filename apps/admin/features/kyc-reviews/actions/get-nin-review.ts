"use server"

import { get } from "@gorro/api/client"
import type { NinReviewDetail } from "@/features/kyc-reviews/types"
import { endpoints } from "@/lib/endpoints"

export async function getNinReviewAction(id: string): Promise<NinReviewDetail> {
  const { data } = await get<NinReviewDetail>(
    endpoints.admin.kycNinReviewById(id)
  )
  return data
}
