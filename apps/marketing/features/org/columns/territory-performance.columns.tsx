"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { cn, formatNgn } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { TerritoryPerformanceRow } from "@/features/org/types"

const highlightClass = "font-semibold text-primary tabular-nums"

export const territoryPerformanceColumns: ColumnDef<TerritoryPerformanceRow>[] =
  [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortHeader label="Territory" column={column} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.name}
          {row.original.code ? (
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {row.original.code}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      accessorKey: "cgaCount",
      header: ({ column }) => <SortHeader label="CGAs" column={column} />,
      cell: ({ row }) => row.original.cgaCount.toLocaleString(),
    },
    {
      accessorKey: "gtvPerCga",
      header: ({ column }) => (
        <SortHeader label="GTV per CGA" column={column} />
      ),
      cell: ({ row }) => (
        <span className={highlightClass}>{formatNgn(row.original.gtvPerCga)}</span>
      ),
    },
    {
      accessorKey: "signupsPerCga",
      header: ({ column }) => (
        <SortHeader label="Sign-ups per CGA" column={column} />
      ),
      cell: ({ row }) => (
        <span className={highlightClass}>
          {row.original.signupsPerCga.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "signups",
      header: ({ column }) => <SortHeader label="Sign-ups" column={column} />,
      cell: ({ row }) => row.original.signups.toLocaleString(),
    },
    {
      accessorKey: "firstDepositRate",
      header: ({ column }) => (
        <SortHeader label="First deposit %" column={column} />
      ),
      cell: ({ row }) => `${row.original.firstDepositRate}%`,
    },
    {
      accessorKey: "gtv",
      header: ({ column }) => <SortHeader label="GTV" column={column} />,
      cell: ({ row }) => formatNgn(row.original.gtv),
    },
    {
      accessorKey: "dormancyRate",
      header: ({ column }) => (
        <SortHeader label="Dormancy %" column={column} />
      ),
      cell: ({ row }) => `${row.original.dormancyRate}%`,
    },
    {
      accessorKey: "fieldActivity",
      header: "Field activity",
      cell: ({ row }) => (
        <span
          className={cn(
            row.original.fieldActivity == null && "text-muted-foreground"
          )}
        >
          {row.original.fieldActivity == null
            ? "Not available"
            : row.original.fieldActivity.toLocaleString()}
        </span>
      ),
    },
  ]
