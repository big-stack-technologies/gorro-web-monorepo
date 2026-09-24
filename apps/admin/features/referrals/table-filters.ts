import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import { BONUS_PAID_FILTER_OPTIONS } from "@/features/referrals/constants"

export const referralsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "bonusPaid",
    label: "Bonus status",
    placeholder: "Bonus status",
    options: BONUS_PAID_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All bonuses",
  },
  {
    type: "text",
    param: "referralCode",
    label: "Refferal Code",
    placeholder: "Code",
  },
  {
    type: "date",
    param: "createdAfter",
    label: "Created after",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "createdBefore",
    label: "Created before",
    boundary: "endOfDay",
  },
]
