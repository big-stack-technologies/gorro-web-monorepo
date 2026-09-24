import { ColumnDef } from "@tanstack/react-table"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import { TransactionRowActions } from "@/features/transactions/ui"
import type { Transaction } from "@/features/transactions/types"
import {
  emptyAsNa,
  formatCurrencyFromMinorUnits,
  formatDateTime,
} from "@gorro/ui/utils"

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.type}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "direction",
    header: "Direction",
    cell: ({ row }) => row.original.direction,
  },
  {
    id: "amount",
    header: "Amount",
    accessorFn: (row) => row.amountMinorUnits,
    cell: ({ row }) =>
      formatCurrencyFromMinorUnits(
        row.original.amountMinorUnits,
        row.original.currency
      ),
  },
  {
    accessorKey: "initiatorId",
    header: "Initiator",
    cell: ({ row }) => (
      <CopyableTruncatedId value={row.original.initiatorId} />
    ),
  },
  {
    accessorKey: "referenceId",
    header: "Reference",
    cell: ({ row }) => (
      <CopyableTruncatedId value={row.original.referenceId} />
    ),
  },
  {
    accessorKey: "postedAt",
    header: "Posted",
    cell: ({ row }) => {
      const v = row.original.postedAt
      return emptyAsNa(v) === "N/A" ? "N/A" : formatDateTime(v)
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const v = row.original.createdAt
      return emptyAsNa(v) === "N/A" ? "N/A" : formatDateTime(v)
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <TransactionRowActions transaction={row.original} />,
  },
]
