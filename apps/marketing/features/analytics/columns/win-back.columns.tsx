"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatSnakeCaseWords } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { MarketingWinBackRow } from "@/features/analytics/types"

export const winBackColumns: ColumnDef<MarketingWinBackRow>[] = [
  {
    accessorKey: "campaign",
    header: ({ column }) => <SortHeader label="Campaign" column={column} />,
    cell: ({ row }) => formatSnakeCaseWords(row.original.campaign),
  },
  {
    accessorKey: "nudged",
    header: ({ column }) => <SortHeader label="Nudged" column={column} />,
    cell: ({ row }) => row.original.nudged.toLocaleString(),
  },
  {
    accessorKey: "transactedAfter",
    header: ({ column }) => (
      <SortHeader label="Transacted after" column={column} />
    ),
    cell: ({ row }) => row.original.transactedAfter.toLocaleString(),
  },
  {
    accessorKey: "ratePct",
    header: ({ column }) => <SortHeader label="Rate" column={column} />,
    cell: ({ row }) => `${row.original.ratePct}%`,
  },
]
