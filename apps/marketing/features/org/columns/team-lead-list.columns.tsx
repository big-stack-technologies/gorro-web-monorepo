"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { MarketingTeamLead } from "@/features/cgas/types"
import { TeamLeadRowActions } from "@/features/org/ui/team-lead-row-actions"

export function createTeamLeadListColumns(): ColumnDef<MarketingTeamLead>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="Name" column={column} />,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      id: "territory",
      header: "Territory",
      cell: ({ row }) =>
        row.original.territory
          ? `${row.original.territory.name} (${row.original.territory.code})`
          : "—",
    },
    {
      id: "linkedUser",
      header: "Linked user",
      cell: ({ row }) => row.original.user?.name ?? "—",
    },
    {
      accessorKey: "cgaCount",
      header: ({ column }) => <SortHeader label="CGAs" column={column} />,
      cell: ({ row }) => row.original.cgaCount.toLocaleString(),
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
      cell: ({ row }) => <TeamLeadRowActions teamLead={row.original} />,
    },
  ]
}
