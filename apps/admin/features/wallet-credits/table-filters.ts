import type { DataTableFilterField } from "@gorro/ui/components/data-table"

import {
  WALLET_CREDIT_CATEGORIES,
  WALLET_CREDIT_CATEGORY_LABELS,
  WALLET_CREDIT_TARGET_TYPES,
  WALLET_CREDIT_TARGET_TYPE_LABELS,
} from "@/features/wallet-credits/constants"

export const walletCreditsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "category",
    label: "Category",
    emptyLabel: "All categories",
    options: WALLET_CREDIT_CATEGORIES.map((value) => ({
      value,
      label: WALLET_CREDIT_CATEGORY_LABELS[value],
    })),
  },
  {
    type: "select",
    param: "targetType",
    label: "Target",
    emptyLabel: "All targets",
    options: WALLET_CREDIT_TARGET_TYPES.map((value) => ({
      value,
      label: WALLET_CREDIT_TARGET_TYPE_LABELS[value],
    })),
  },
  // {
  //   type: "text",
  //   param: "adminUserId",
  //   label: "Admin user ID",
  //   placeholder: "UUID",
  // },
  // {
  //   type: "text",
  //   param: "ownerUserId",
  //   label: "Owner user ID",
  //   placeholder: "UUID",
  // },
  {
    type: "date",
    param: "fromDate",
    label: "From",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "toDate",
    label: "To",
    boundary: "endOfDay",
  },
]
