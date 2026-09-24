import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import {
  getReengagementCampaignLabel,
  REENGAGEMENT_CHANNEL_LABELS,
} from "@/features/reengagement/constants"
import type { ReengagementNudge } from "@/features/reengagement/types"
import { formatDateTime } from "@gorro/ui/utils"

export const reengagementNudgesColumns: ColumnDef<ReengagementNudge>[] = [
  {
    accessorKey: "campaign",
    header: "Campaign",
    cell: ({ row }) => (
      <span className="font-medium">
        {getReengagementCampaignLabel(row.original.campaign)}
      </span>
    ),
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => (
      <Badge variant="outline">
        {REENGAGEMENT_CHANNEL_LABELS[row.original.channel]}
      </Badge>
    ),
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-medium">{row.original.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.email}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {row.original.phone}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "kycTier",
    header: "KYC tier",
    cell: ({ row }) => row.original.kycTier.toLocaleString(),
  },
  {
    accessorKey: "sentAt",
    header: "Sent",
    cell: ({ row }) => formatDateTime(row.original.sentAt),
  },
]
