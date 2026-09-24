import {
  ADDRESS_REVIEW_PENDING_STATUS,
  ADDRESS_REVIEW_STATUS_FILTER_OPTIONS,
  NIN_REVIEW_PENDING_STATUS,
  NIN_REVIEW_STATUS_FILTER_OPTIONS,
} from "@/features/kyc-reviews/constants"
import type { DataTableFilterField } from "@gorro/ui/components/data-table"

export const ninReviewsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: NIN_REVIEW_STATUS_FILTER_OPTIONS.map((o) => ({ ...o })),
    clearable: false,
  },
]

export const ninReviewsDefaultFilters = {
  status: NIN_REVIEW_PENDING_STATUS,
} as const

export const addressReviewsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: ADDRESS_REVIEW_STATUS_FILTER_OPTIONS.map((option) => ({
      ...option,
    })),
    clearable: false,
  },
]

export const addressReviewsDefaultFilters = {
  status: ADDRESS_REVIEW_PENDING_STATUS,
} as const
