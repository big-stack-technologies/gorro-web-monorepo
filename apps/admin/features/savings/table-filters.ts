import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  SAVINGS_ACCOUNT_STATUS_FILTER_OPTIONS,
  SAVINGS_KYC_TIER_FILTER_OPTIONS,
  SAVINGS_METRICS_PRODUCT_FILTER_OPTIONS,
} from "@/features/savings/constants"

export const savingsAccountsTableFilters: DataTableFilterField[] = [
  {
    type: "text",
    param: "email",
    label: "Email",
    placeholder: "Email",
  },
  {
    type: "text",
    param: "phone",
    label: "Phone",
    placeholder: "Phone",
  },
  {
    type: "select",
    param: "product",
    label: "Product",
    placeholder: "Product",
    options: SAVINGS_METRICS_PRODUCT_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All products",
  },
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: SAVINGS_ACCOUNT_STATUS_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All statuses",
  },
  {
    type: "select",
    param: "kycTier",
    label: "KYC tier",
    placeholder: "KYC tier",
    options: SAVINGS_KYC_TIER_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All tiers",
  },
  {
    type: "date",
    param: "from",
    label: "Opened from",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "to",
    label: "Opened to",
    boundary: "endOfDay",
  },
]
