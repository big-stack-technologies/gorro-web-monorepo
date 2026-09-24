"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { MarketingDormancyByCgaRow } from "@/features/analytics/types"

export const dormancyByCgaColumns: ColumnDef<MarketingDormancyByCgaRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader label="CGA" column={column} />,
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "neverActivated",
    header: ({ column }) => (
      <SortHeader label="Never started" column={column} />
    ),
    cell: ({ row }) => row.original.neverActivated.toLocaleString(),
  },
  {
    accessorKey: "active",
    header: ({ column }) => <SortHeader label="Active" column={column} />,
    cell: ({ row }) => row.original.active.toLocaleString(),
  },
  {
    accessorKey: "dormant",
    header: ({ column }) => <SortHeader label="Dormant" column={column} />,
    cell: ({ row }) => row.original.dormant.toLocaleString(),
  },
  {
    accessorKey: "dormancyRate",
    header: ({ column }) => (
      <SortHeader label="Dormancy rate" column={column} />
    ),
    cell: ({ row }) => `${row.original.dormancyRate}%`,
  },
]
