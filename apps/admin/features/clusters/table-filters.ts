import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  CLUSTER_STATUS_OPTIONS,
  CLUSTER_WITHDRAWAL_STATUS_OPTIONS,
} from "@/features/clusters/constants"

export const clustersTableFilters: DataTableFilterField[] = [
  {
    type: "text",
    param: "search",
    label: "Search",
    placeholder: "Name or code",
  },
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: CLUSTER_STATUS_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All statuses",
  },
]

export const clusterWithdrawalsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: CLUSTER_WITHDRAWAL_STATUS_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All statuses",
  },
]
