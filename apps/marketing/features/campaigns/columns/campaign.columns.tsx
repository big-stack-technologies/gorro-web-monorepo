"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatNgn, formatUtcDate } from "@gorro/ui/utils"

import type { MarketingCampaign } from "@/features/campaigns/types"

export const campaignColumns: ColumnDef<MarketingCampaign>[] = [
  {
    accessorKey: "name",
    header: "Campaign",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    id: "period",
    header: "Period",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatUtcDate(row.original.startsOn)} –{" "}
        {formatUtcDate(row.original.endsOn)}
      </span>
    ),
  },
  {
    id: "territory",
    header: "Territory",
    cell: ({ row }) =>
      row.original.territory?.name ?? (
        <span className="text-muted-foreground">All</span>
      ),
  },
  {
    accessorKey: "targetAudience",
    header: "Audience",
    cell: ({ row }) =>
      row.original.targetAudience ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) =>
      row.original.cost != null ? (
        formatNgn(row.original.cost)
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
]
