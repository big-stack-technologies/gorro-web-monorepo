"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { formatDateTime, formatSnakeCaseWords } from "@gorro/ui/utils"

import type { CgaCustomer } from "@/features/cgas/types"

export const cgaCustomersColumns: ColumnDef<CgaCustomer>[] = [
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => formatDateTime(row.original.joinedAt),
  },
  {
    accessorKey: "kycCompleted",
    header: "KYC",
    cell: ({ row }) => (row.original.kycCompleted ? "Complete" : "Pending"),
  },
  {
    accessorKey: "hasDeposited",
    header: "First deposit",
    cell: ({ row }) => (row.original.hasDeposited ? "Yes" : "No"),
  },
  {
    accessorKey: "lastTransactionAt",
    header: "Last transaction",
    cell: ({ row }) =>
      row.original.lastTransactionAt
        ? formatDateTime(row.original.lastTransactionAt)
        : "—",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {formatSnakeCaseWords(row.original.state)}
      </Badge>
    ),
  },
]
