"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import { formatDateTime, formatNgn } from "@gorro/ui/utils"

import {
  WALLET_CREDIT_CATEGORY_LABELS,
  WALLET_CREDIT_STATUS_LABELS,
  WALLET_CREDIT_TARGET_TYPE_LABELS,
} from "@/features/wallet-credits/constants"
import type { WalletCreditListItem } from "@/features/wallet-credits/types"
import { WalletCreditRowActions } from "@/features/wallet-credits/ui/wallet-credit-row-actions"

function statusVariant(status: string) {
  if (status === "POSTED") return "success" as const
  if (status === "REVERSED") return "secondary" as const
  return "outline" as const
}

export const walletCreditsColumns: ColumnDef<WalletCreditListItem>[] = [
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {WALLET_CREDIT_STATUS_LABELS[row.original.status] ??
          row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) =>
      WALLET_CREDIT_CATEGORY_LABELS[row.original.category] ??
      row.original.category,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatNgn(row.original.amount),
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) => row.original.owner.name,
  },
  {
    accessorKey: "accountNumber",
    header: "Account",
    cell: ({ row }) => row.original.accountNumber,
  },
  {
    accessorKey: "targetType",
    header: "Target",
    cell: ({ row }) =>
      WALLET_CREDIT_TARGET_TYPE_LABELS[row.original.targetType] ??
      row.original.targetType,
  },
  {
    accessorKey: "admin",
    header: "Admin",
    cell: ({ row }) => row.original.admin.name,
  },
  {
    accessorKey: "transactionId",
    header: "Transaction",
    cell: ({ row }) => (
      <CopyableTruncatedId value={row.original.transactionId} />
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span
        className="line-clamp-2 max-w-[14rem] text-xs text-muted-foreground"
        title={row.original.reason}
      >
        {row.original.reason}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <WalletCreditRowActions credit={row.original} />,
  },
]
