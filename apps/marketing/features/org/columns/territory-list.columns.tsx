"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { MarketingTerritory } from "@/features/cgas/types"
import { TerritoryRowActions } from "@/features/org/ui/territory-row-actions"

export function createTerritoryListColumns(): ColumnDef<MarketingTerritory>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="Name" column={column} />,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "code",
      header: ({ column }) => <SortHeader label="Code" column={column} />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <TerritoryRowActions territory={row.original} />
      ),
    },
  ]
}
