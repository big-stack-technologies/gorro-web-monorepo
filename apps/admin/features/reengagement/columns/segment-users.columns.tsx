import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import type { SegmentUser } from "@/features/reengagement/types"
import { emptyAsNa, formatDateTime } from "@gorro/ui/utils"

export const segmentUsersColumns: ColumnDef<SegmentUser>[] = [
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
    accessorKey: "signedUpAt",
    header: "Signed up",
    cell: ({ row }) => formatDateTime(row.original.signedUpAt),
  },
  {
    accessorKey: "nudgesSent",
    header: "Nudges sent",
    cell: ({ row }) => row.original.nudgesSent.toLocaleString(),
  },
  {
    accessorKey: "lastNudgeAt",
    header: "Last nudge",
    cell: ({ row }) =>
      row.original.lastNudgeAt
        ? formatDateTime(row.original.lastNudgeAt)
        : emptyAsNa(null),
  },
  {
    accessorKey: "dueNow",
    header: "Due now",
    cell: ({ row }) => (
      <Badge variant={row.original.dueNow ? "success" : "destructive"}>
        {row.original.dueNow ? "Yes" : "No"}
      </Badge>
    ),
  },
]
