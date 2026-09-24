"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatNgn } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { CgaMetricsSummaryItem } from "@/features/cgas/types"

export const cgaMetricsSummaryColumns: ColumnDef<CgaMetricsSummaryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader label="CGA" column={column} />,
    cell: ({ row }) => (
      <div className="min-w-[10rem]">
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "referralCode",
    header: "Referral code",
  },
  {
    accessorKey: "totalReferrals",
    header: ({ column }) => (
      <SortHeader label="Lifetime referrals" column={column} />
    ),
    cell: ({ row }) => row.original.totalReferrals.toLocaleString(),
  },
  {
    accessorKey: "newReferralsInRange",
    header: ({ column }) => (
      <SortHeader label="New in range" column={column} />
    ),
    cell: ({ row }) => row.original.newReferralsInRange.toLocaleString(),
  },
  {
    accessorKey: "bonusEarnedInRange",
    header: ({ column }) => (
      <SortHeader label="Bonus in range" column={column} />
    ),
    cell: ({ row }) => formatNgn(row.original.bonusEarnedInRange),
  },
  {
    accessorKey: "customerSavingsOpenedInRange",
    header: ({ column }) => (
      <SortHeader label="Savings opened" column={column} />
    ),
    cell: ({ row }) =>
      row.original.customerSavingsOpenedInRange.toLocaleString(),
  },
  {
    accessorKey: "bookValue",
    header: ({ column }) => <SortHeader label="Book value" column={column} />,
    cell: ({ row }) => formatNgn(row.original.bookValue),
  },
]
