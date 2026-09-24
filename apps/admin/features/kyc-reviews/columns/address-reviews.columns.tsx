import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import type { AddressReview, AddressReviewAddress } from "@/features/kyc-reviews/types"
import { AddressReviewRowActions } from "@/features/kyc-reviews/ui/address-review-row-actions"
import { NinReviewSlaBadge } from "@/features/kyc-reviews/ui/nin-review-sla-badge"
import { routes } from "@/lib/routes"
import { emptyAsNa, formatDateTime } from "@gorro/ui/utils"

function AddressCell({ address }: { address: AddressReviewAddress | null }) {
  if (!address) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const locality = [address.city, address.state].filter(Boolean).join(", ")

  return (
    <div className="min-w-0 space-y-0.5 text-sm">
      <div className="truncate">{address.addressLine || "—"}</div>
      {locality ? (
        <div className="truncate text-xs text-muted-foreground">{locality}</div>
      ) : null}
      {address.lga ? (
        <div className="truncate text-xs text-muted-foreground">{address.lga}</div>
      ) : null}
    </div>
  )
}

export const addressReviewsColumns: ColumnDef<AddressReview>[] = [
  {
    id: "user",
    header: "Customer",
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
          <Link
            href={routes.protected.kycAddressReviews.detail(row.original.id)}
            className="truncate font-medium underline-offset-4 hover:underline"
          >
            {emptyAsNa(user.name)}
          </Link>
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
    id: "address",
    header: "Claimed address",
    cell: ({ row }) => <AddressCell address={row.original.address} />,
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
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <AddressReviewRowActions review={row.original} />,
  },
]
