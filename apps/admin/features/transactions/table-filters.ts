import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  TRANSACTION_DIRECTION_FILTER_OPTIONS,
  TRANSACTION_STATUS_FILTER_OPTIONS,
  TRANSACTION_TYPE_FILTER_OPTIONS,
} from "@/features/transactions/constants"

/** Transactions list: filter config for the shared DataTable filter bar. */
export const transactionsTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: TRANSACTION_STATUS_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All statuses",
  },
  {
    type: "select",
    param: "type",
    label: "Type",
    placeholder: "Type",
    options: TRANSACTION_TYPE_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All types",
  },
  {
    type: "select",
    param: "direction",
    label: "Direction",
    placeholder: "Direction",
    options: TRANSACTION_DIRECTION_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All directions",
  },
  {
    type: "text",
    param: "initiatorId",
    label: "Initiator ID",
    placeholder: "UUID",
  },
  {
    type: "text",
    param: "recipientId",
    label: "Recipient ID",
    placeholder: "UUID",
  },
  {
    type: "text",
    param: "referenceId",
    label: "Reference ID",
    placeholder: "UUID",
  },
  {
    type: "number",
    param: "minAmount",
    label: "Min amount",
    placeholder: "Major units (e.g. 100.50)",
  },
  {
    type: "number",
    param: "maxAmount",
    label: "Max amount",
    placeholder: "Major units (e.g. 100.50)",
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
