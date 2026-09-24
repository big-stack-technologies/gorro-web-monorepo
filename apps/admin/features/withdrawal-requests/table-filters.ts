import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  WITHDRAWAL_REQUEST_PROVIDER_FILTER_OPTIONS,
  WITHDRAWAL_REQUEST_STATUS_FILTER_OPTIONS,
} from "@/features/withdrawal-requests/constants"

export const withdrawalRequestsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: WITHDRAWAL_REQUEST_STATUS_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All statuses",
  },
  {
    type: "select",
    param: "provider",
    label: "Provider",
    placeholder: "Provider",
    options: WITHDRAWAL_REQUEST_PROVIDER_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All providers",
  },
]
