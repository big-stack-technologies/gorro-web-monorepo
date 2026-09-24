import { ColumnDef } from "@tanstack/react-table"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import type { NinReview } from "@/features/kyc-reviews/types"
import { NinReviewAutoMatchSummary } from "@/features/kyc-reviews/ui/nin-review-auto-match-panel"
import { NinReviewRowActions } from "@/features/kyc-reviews/ui/nin-review-row-actions"
import { NinReviewSlaBadge } from "@/features/kyc-reviews/ui/nin-review-sla-badge"
import { emptyAsNa, formatDateTime } from "@gorro/ui/utils"

export const ninReviewsColumns: ColumnDef<NinReview>[] = [
  {
    id: "user",
    header: "User",
    accessorFn: (row) => row.user?.name ?? row.user?.email ?? row.user?.id ?? "",
    cell: ({ row }) => {
      const { user } = row.original

      if (!user) {
        return (
          <span className="text-sm text-muted-foreground italic">
            Unknown user
          </span>
        )
      }

      return (
        <div className="min-w-0 space-y-1">
          <div className="truncate font-medium">{emptyAsNa(user.name)}</div>
          <div className="truncate text-xs text-muted-foreground">
            {emptyAsNa(user.email)}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {emptyAsNa(user.phone)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">Tier {user.kycTier}</Badge>
            <CopyableTruncatedId value={user.id} />
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "nin",
    header: "NIN",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.nin}</span>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
  },
  {
    id: "waiting",
    header: "Waiting",
    accessorFn: (row) => row.waitingHours,
    cell: ({ row }) => (
      <NinReviewSlaBadge waitingHours={row.original.waitingHours} />
    ),
  },
  {
    id: "autoMatch",
    header: "Auto match",
    cell: ({ row }) => (
      <NinReviewAutoMatchSummary autoMatch={row.original.autoMatch} />
    ),
  },
  {
    id: "registry",
    header: "Registry",
    accessorFn: (row) => row.hasRegistryData,
    cell: ({ row }) => (
      <Badge variant={row.original.hasRegistryData ? "success" : "outline"}>
        {row.original.hasRegistryData ? "Available" : "Missing"}
      </Badge>
    ),
  },
  {
    id: "vendorError",
    header: "Vendor error",
    accessorFn: (row) => row.vendorError,
    cell: ({ row }) => (
      <span
        className="block max-w-48 truncate text-sm text-muted-foreground"
        title={row.original.vendorError ?? undefined}
      >
        {row.original.vendorError ?? "—"}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <NinReviewRowActions review={row.original} />,
  },
]
