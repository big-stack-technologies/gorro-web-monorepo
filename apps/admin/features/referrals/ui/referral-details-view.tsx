"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import {
  CircleAlertIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Separator } from "@gorro/ui/components/ui/separator"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { USER_ROLE } from "@/features/users/constants"
import { REFERRAL_CURRENCY } from "@/features/referrals/constants"
import type { ReferralPair } from "@/features/referrals/types"
import { RetriggerReferralBonusesDialog } from "@/features/referrals/ui/retrigger-referral-bonuses-dialog"
import { useUserReferralDetails } from "@/features/referrals/usecases"
import { routes } from "@/lib/routes"
import { emptyAsNa, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

function DetailField({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 text-sm sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium wrap-break-word">{value}</dd>
    </div>
  )
}

function ReferralPairTable({ referrals }: { referrals: ReferralPair[] }) {
  if (referrals.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
        No referrals yet
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Referee</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Bonus</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow key={`${referral.referrerId}-${referral.refereeId}`}>
            <TableCell>
              <div className="min-w-0 space-y-0.5">
                <Link
                  href={routes.protected.referrals.detail(referral.refereeId)}
                  className="truncate font-medium hover:underline"
                >
                  {referral.refereeName}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  {emptyAsNa(referral.refereeEmail)}
                </p>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs">
              {referral.refereeReferralCode}
            </TableCell>
            <TableCell>{formatDateTime(referral.refereeJoinedAt)}</TableCell>
            <TableCell>
              <Badge variant={referral.bonusPaid ? "default" : "secondary"}>
                {referral.bonusPaid ? "Paid" : "Pending"}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrencyAmount(referral.bonusAmount, REFERRAL_CURRENCY)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export type ReferralDetailsViewProps = {
  userId: string
}

export function ReferralDetailsView({ userId }: ReferralDetailsViewProps) {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserReferralDetails(userId)

  const [retriggerOpen, setRetriggerOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-xl border border-destructive/25 bg-destructive/6 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <CircleAlertIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-destructive">
              Couldn&apos;t load referral details
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { user, referredBy, referrals, summary } = data
  const fullName = `${user.firstName} ${user.lastName}`.trim()

  return (
    <div className="space-y-6">
      <Card className="border-border/80 ring-1 ring-border/50">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{fullName}</CardTitle>
            <CardDescription>Referral profile and codes</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <DetailField label="Email" value={emptyAsNa(user.email)} />
            <DetailField label="Phone" value={emptyAsNa(user.phoneNumber)} />
            <DetailField
              label="Referral code"
              value={
                <span className="font-mono text-sm">{user.referralCode}</span>
              }
            />
            <DetailField
              label="Referred by code"
              value={
                user.refereeCode ? (
                  <span className="font-mono text-sm">{user.refereeCode}</span>
                ) : (
                  "—"
                )
              }
            />
            <DetailField
              label="Joined"
              value={formatDateTime(user.createdAt)}
            />
          </dl>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/80 ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Total referrals</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {summary.totalReferrals.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/80 ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Bonuses earned</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrencyAmount(
                summary.totalBonusesEarned,
                REFERRAL_CURRENCY
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/80 ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Bonuses paid</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrencyAmount(
                summary.totalBonusesPaid,
                REFERRAL_CURRENCY
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/80 ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Pending bonuses</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrencyAmount(summary.pendingBonuses, REFERRAL_CURRENCY)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {referredBy ? (
        <Card className="border-border/80 ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="text-base">Referred by</CardTitle>
            <CardDescription>
              Who invited this user to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <DetailField
                label="Referrer"
                value={
                  <Link
                    href={routes.protected.referrals.detail(
                      referredBy.referrerId
                    )}
                    className="hover:underline"
                  >
                    {referredBy.referrerName}
                  </Link>
                }
              />
              <DetailField
                label="Referrer email"
                value={emptyAsNa(referredBy.referrerEmail)}
              />
              <DetailField
                label="Referrer code"
                value={
                  <span className="font-mono text-sm">
                    {referredBy.referrerReferralCode}
                  </span>
                }
              />
              <DetailField
                label="Joined"
                value={formatDateTime(referredBy.refereeJoinedAt)}
              />
              <DetailField
                label="Bonus status"
                value={
                  <Badge variant={referredBy.bonusPaid ? "default" : "secondary"}>
                    {referredBy.bonusPaid ? "Paid" : "Pending"}
                  </Badge>
                }
              />
              <DetailField
                label="Bonus amount"
                value={formatCurrencyAmount(
                  referredBy.bonusAmount,
                  REFERRAL_CURRENCY
                )}
              />
            </dl>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/80 ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="text-base">Their referrals</CardTitle>
          <CardDescription>
            Users referred by {fullName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReferralPairTable referrals={referrals} />
        </CardContent>
      </Card>

      {isSuperAdmin ? (
        <>
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Retrigger unpaid bonuses</p>
              <p className="text-sm text-muted-foreground">
                Process any pending referral bonuses for this user.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRetriggerOpen(true)}
            >
              <RefreshCwIcon data-icon="inline-start" />
              Retrigger bonuses
            </Button>
          </div>
          <RetriggerReferralBonusesDialog
            userId={userId}
            userName={fullName}
            open={retriggerOpen}
            onOpenChange={setRetriggerOpen}
          />
        </>
      ) : null}
    </div>
  )
}
