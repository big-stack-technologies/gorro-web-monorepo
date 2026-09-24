import { ColumnDef } from "@tanstack/react-table"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import { WITHDRAWAL_REQUEST_CURRENCY } from "@/features/withdrawal-requests/constants"
import type { WithdrawalRequest } from "@/features/withdrawal-requests/types"
import { WithdrawalRequestRowActions } from "@/features/withdrawal-requests/ui/withdrawal-request-row-actions"
import { formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

export const withdrawalRequestsColumns: ColumnDef<WithdrawalRequest>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.provider}</Badge>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    accessorFn: (row) => row.amount,
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.amount, WITHDRAWAL_REQUEST_CURRENCY),
  },
  {
    id: "fee",
    header: "Fee",
    accessorFn: (row) => row.fee,
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.fee, WITHDRAWAL_REQUEST_CURRENCY),
  },
  {
    id: "totalDebit",
    header: "Total debit",
    accessorFn: (row) => row.totalDebit,
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.totalDebit, WITHDRAWAL_REQUEST_CURRENCY),
  },
  {
    accessorKey: "recipientName",
    header: "Recipient",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium">{row.original.recipientName}</div>
        <div className="truncate text-xs text-muted-foreground">
          {row.original.bankName} · {row.original.recipientAccount}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <CopyableTruncatedId value={row.original.reference} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <WithdrawalRequestRowActions withdrawalRequest={row.original} />
    ),
  },
]
