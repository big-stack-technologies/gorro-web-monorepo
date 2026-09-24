"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatNgn, formatSnakeCaseWords, formatUtcDate } from "@gorro/ui/utils"

import type { MarketingSegmentUser } from "@/features/segments/types"

export function createSegmentUsersColumns(options: {
  showAjoGroup: boolean
}): ColumnDef<MarketingSegmentUser>[] {
  const base: ColumnDef<MarketingSegmentUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="max-w-48 truncate">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "kycTier",
      header: "KYC",
      cell: ({ row }) =>
        row.original.kycTier ?? (
          <span className="text-muted-foreground">None</span>
        ),
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => formatUtcDate(row.original.joinedAt),
    },
    {
      accessorKey: "lastTransactionAt",
      header: "Last txn",
      cell: ({ row }) =>
        row.original.lastTransactionAt ? (
          formatUtcDate(row.original.lastTransactionAt)
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => formatNgn(row.original.balance),
    },
  ]

  if (options.showAjoGroup) {
    base.push(
      {
        id: "ajoGroup",
        header: "Ajo group",
        cell: ({ row }) => row.original.ajoGroup?.name ?? "—",
      },
      {
        id: "ajoStatus",
        header: "Group status",
        cell: ({ row }) =>
          row.original.ajoGroup?.status
            ? formatSnakeCaseWords(row.original.ajoGroup.status)
            : "—",
      }
    )
  }

  return base
}
