"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import { formatFinanceLabel, formatKobo } from "@/features/finance/format"
import type {
  FinanceKycCheckVolume,
  FinanceProcessorCost,
} from "@/features/finance/types"

export const processorCostColumns: ColumnDef<FinanceProcessorCost>[] = [
  {
    accessorKey: "rail",
    header: ({ column }) => <SortHeader label="Processor" column={column} />,
    cell: ({ row }) => formatFinanceLabel(row.original.rail),
  },
  {
    accessorKey: "count",
    header: ({ column }) => <SortHeader label="Charges" column={column} />,
    cell: ({ row }) => row.original.count.toLocaleString(),
  },
  {
    accessorKey: "minorUnits",
    header: ({ column }) => <SortHeader label="Cost" column={column} />,
    cell: ({ row }) => (
      <span className="tabular-nums">{formatKobo(row.original.minorUnits)}</span>
    ),
  },
]

/** Volume only — no naira column on purpose. */
export const kycCheckColumns: ColumnDef<FinanceKycCheckVolume>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => <SortHeader label="Check" column={column} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortHeader label="Status" column={column} />,
    cell: ({ row }) => formatFinanceLabel(row.original.status),
  },
  {
    accessorKey: "checks",
    header: ({ column }) => <SortHeader label="Checks" column={column} />,
    cell: ({ row }) => row.original.checks.toLocaleString(),
  },
]
