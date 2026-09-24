"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { formatNgn, formatSnakeCaseWords, formatUtcDate } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import { COMMUNITY_TYPE_LABELS } from "@/features/communities/constants"
import type { MarketingCommunity } from "@/features/communities/types"
import { CommunityRowActions } from "@/features/communities/ui/community-row-actions"

function activityStatusVariant(status: string) {
  if (status === "ACTIVE") return "success" as const
  if (status === "DORMANT") return "secondary" as const
  if (status === "EMPTY") return "outline" as const
  return "secondary" as const
}

function formatPenetration(penetrationPct: number | null) {
  if (penetrationPct == null) return "—"
  return `${penetrationPct.toFixed(1)}%`
}

function communityTypeLabel(type: string | null) {
  if (!type) return "—"
  return (
    COMMUNITY_TYPE_LABELS[type as keyof typeof COMMUNITY_TYPE_LABELS] ??
    formatSnakeCaseWords(type)
  )
}

export function createCommunityListColumns(): ColumnDef<MarketingCommunity>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="Name" column={column} />,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => <SortHeader label="Type" column={column} />,
      cell: ({ row }) => communityTypeLabel(row.original.type),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location?.trim() || "—",
    },
    {
      accessorKey: "activityStatus",
      header: "Activity",
      cell: ({ row }) => {
        const status = row.original.activityStatus
        return (
          <Badge variant={activityStatusVariant(status)}>
            {formatSnakeCaseWords(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "registeredMembers",
      header: ({ column }) => <SortHeader label="Members" column={column} />,
      cell: ({ row }) => row.original.registeredMembers.toLocaleString(),
    },
    {
      id: "penetration",
      header: "Penetration",
      cell: ({ row }) => formatPenetration(row.original.penetrationPct),
    },
    {
      accessorKey: "territory",
      header: "Territory",
      cell: ({ row }) => {
        const territory = row.original.territory
        if (!territory) return "—"
        return `${territory.name} (${territory.code})`
      },
    },
    {
      accessorKey: "teamLead",
      header: "Team lead",
      cell: ({ row }) => row.original.teamLead?.name ?? "—",
    },
    {
      accessorKey: "cga",
      header: "CGA",
      cell: ({ row }) => row.original.cga?.name ?? "—",
    },
    {
      accessorKey: "transactionValue",
      header: ({ column }) => <SortHeader label="GTV" column={column} />,
      cell: ({ row }) => formatNgn(row.original.transactionValue),
    },
    {
      accessorKey: "acquiredOn",
      header: ({ column }) => <SortHeader label="Acquired" column={column} />,
      cell: ({ row }) =>
        row.original.acquiredOn
          ? formatUtcDate(row.original.acquiredOn)
          : "—",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <CommunityRowActions community={row.original} />
      ),
    },
  ]
}
