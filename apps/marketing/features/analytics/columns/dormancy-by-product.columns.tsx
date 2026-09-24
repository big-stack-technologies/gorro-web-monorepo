"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatSnakeCaseWords } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { MarketingDormancyByProductRow } from "@/features/analytics/types"

export const dormancyByProductColumns: ColumnDef<MarketingDormancyByProductRow>[] =
  [
    {
      accessorKey: "product",
      header: ({ column }) => <SortHeader label="Product" column={column} />,
      cell: ({ row }) => formatSnakeCaseWords(row.original.product),
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
