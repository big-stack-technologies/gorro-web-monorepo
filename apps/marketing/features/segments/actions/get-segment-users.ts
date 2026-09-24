"use server"

import { get } from "@gorro/api/client"
import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

import { endpoints } from "@/lib/endpoints"

import type {
  MarketingSegmentKey,
  MarketingSegmentUser,
  MarketingSegmentUsersResponse,
  SegmentThresholdOptions,
} from "@/features/segments/types"

export async function getSegmentUsersAction(
  segment: MarketingSegmentKey,
  options: SegmentThresholdOptions,
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<MarketingSegmentUser>> {
  try {
    const { data } = await get<MarketingSegmentUsersResponse>(
      endpoints.marketing.segment(segment),
      {
        params: {
          ...buildPaginatedListQueryParams(params),
          minDaysSinceSignup: options.minDaysSinceSignup,
          inactiveDays: options.inactiveDays,
          nearZeroBalance: options.nearZeroBalance,
        },
      }
    )
    const totalPages = Math.max(1, Math.ceil(data.total / data.limit))
    return {
      data: data.users,
      meta: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages,
        hasNextPage: data.page < totalPages,
        hasPreviousPage: data.page > 1,
      },
    }
  } catch (error) {
    console.error("Failed to load segment users:", error)
    throw error
  }
}
