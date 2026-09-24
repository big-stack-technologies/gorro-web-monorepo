import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { REFERRAL_CURRENCY } from "@/features/referrals/constants"
import type { ReferralPair } from "@/features/referrals/types"
import { ReferralRowActions } from "@/features/referrals/ui/referral-row-actions"
import { emptyAsNa, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

function PersonCell({
  name,
  email,
}: {
  name: string
  email: string | null
}) {
  return (
    <div className="min-w-0 space-y-0.5">
      <p className="truncate font-medium">{name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {emptyAsNa(email)}
      </p>
    </div>
  )
}

export const referralsColumns: ColumnDef<ReferralPair>[] = [
  {
    id: "referrer",
    header: "Referrer",
    accessorFn: (row) => row.referrerName,
    cell: ({ row }) => (
      <PersonCell
        name={row.original.referrerName}
        email={row.original.referrerEmail}
      />
    ),
  },
  {
    accessorKey: "referrerReferralCode",
    header: "Referrer code",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.referrerReferralCode}</span>
    ),
  },
  {
    id: "referee",
    header: "Referee",
    accessorFn: (row) => row.refereeName,
    cell: ({ row }) => (
      <PersonCell
        name={row.original.refereeName}
        email={row.original.refereeEmail}
      />
    ),
  },
  {
    accessorKey: "refereeReferralCode",
    header: "Referee code",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.refereeReferralCode}</span>
    ),
  },
  {
    accessorKey: "refereeJoinedAt",
    header: "Joined",
    cell: ({ row }) => formatDateTime(row.original.refereeJoinedAt),
  },
  {
    id: "bonusStatus",
    header: "Bonus status",
    accessorFn: (row) => row.bonusPaid,
    cell: ({ row }) => (
      <Badge variant={row.original.bonusPaid ? "default" : "secondary"}>
        {row.original.bonusPaid ? "Paid" : "Pending"}
      </Badge>
    ),
  },
  {
    id: "bonusAmount",
    header: "Bonus amount",
    accessorFn: (row) => row.bonusAmount,
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.bonusAmount, REFERRAL_CURRENCY),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ReferralRowActions referral={row.original} />,
  },
]
