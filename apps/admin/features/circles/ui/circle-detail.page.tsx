"use client"

import type { ComponentType, ReactNode } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  RefreshCwIcon,
  TargetIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import {
  CIRCLE_CURRENCY,
  CIRCLE_MEMBER_ROLE_LABELS,
  CIRCLE_VISIBILITY_LABELS,
} from "@/features/circles/constants"
import type { CircleMember } from "@/features/circles/types"
import { CircleProgress } from "@/features/circles/ui/circle-progress"
import {
  CircleMemberStatusBadge,
  CircleStatusBadge,
} from "@/features/circles/ui/circle-status-badge"
import { useCircle } from "@/features/circles/usecases"
import { routes } from "@/lib/routes"
import {
  formatCurrencyAmount,
  formatDateTime,
  formatUtcDate,
} from "@gorro/ui/utils"

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint?: ReactNode
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-xl font-semibold tabular-nums">{value}</p>
        {hint ? (
          <div className="text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr] gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium wrap-break-word">{value}</dd>
    </div>
  )
}

/**
 * `funded` with a ₦0 principal is a real state, not a bug: withdrawing leaves the
 * plan active, so someone who contributed and took it all out still counts as funded.
 */
function FundingBadge({ member }: { member: CircleMember }) {
  if (!member.funded) return <Badge variant="outline">Not funded</Badge>
  if (member.principalNaira === 0) {
    return <Badge variant="secondary">Contributed, withdrawn</Badge>
  }
  return <Badge variant="success">Funded</Badge>
}

function MembersTable({ members }: { members: CircleMember[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Funding</TableHead>
            <TableHead className="text-right">Principal</TableHead>
            <TableHead className="text-right">Accrued interest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                No members found.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.userId}>
                <TableCell>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {member.phoneNumber}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {CIRCLE_MEMBER_ROLE_LABELS[member.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CircleMemberStatusBadge status={member.status} />
                </TableCell>
                <TableCell>
                  {member.joinedAt ? formatDateTime(member.joinedAt) : "—"}
                </TableCell>
                <TableCell>
                  <FundingBadge member={member} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrencyAmount(member.principalNaira, CIRCLE_CURRENCY)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrencyAmount(
                    member.accruedInterestNaira,
                    CIRCLE_CURRENCY
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function CircleDetailPage({ circleId }: { circleId: string }) {
  const circleQuery = useCircle(circleId)

  if (circleQuery.isLoading && !circleQuery.data) {
    return (
      <div className="flex flex-col gap-6 px-4 lg:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  if (circleQuery.isError || !circleQuery.data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-destructive">
          {circleQuery.error instanceof Error
            ? circleQuery.error.message
            : "Could not load circle details."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => circleQuery.refetch()}
        >
          <RefreshCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </div>
    )
  }

  const { circle, members } = circleQuery.data

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
        <Link href={routes.protected.circles.base}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to circles
        </Link>
      </Button>

      <div className="flex min-w-0 flex-col gap-2">
        <AdminPageHeader title={circle.name} description={circle.code} />
        <div className="flex flex-wrap items-center gap-2">
          <CircleStatusBadge status={circle.status} />
          <Badge variant="outline">
            {CIRCLE_VISIBILITY_LABELS[circle.visibility]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Goal"
          value={formatCurrencyAmount(circle.goalNaira, CIRCLE_CURRENCY)}
          icon={TargetIcon}
        />
        <MetricCard
          label="Saved"
          value={formatCurrencyAmount(circle.savedNaira, CIRCLE_CURRENCY)}
          hint={<CircleProgress percentSaved={circle.percentSaved} />}
          icon={BanknoteIcon}
        />
        <MetricCard
          label="Active members"
          value={circle.memberCount.toLocaleString()}
          icon={UsersRoundIcon}
        />
        <MetricCard
          label="Ever funded"
          value={circle.fundedMemberCount.toLocaleString()}
          hint="Includes members who later left"
          icon={UserRoundCheckIcon}
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Circle information</CardTitle>
          <CardDescription>Ownership and term.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
          <dl className="flex flex-col gap-4">
            <DetailField label="Owner" value={circle.ownerName} />
            <DetailField
              label="Created"
              value={formatDateTime(circle.createdAt)}
            />
          </dl>
          <dl className="flex flex-col gap-4">
            <DetailField
              label="Starts"
              value={formatUtcDate(circle.startDate)}
            />
            <DetailField
              label="Matures"
              value={formatUtcDate(circle.maturityDate)}
            />
          </dl>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-2">
        <div>
          <h2 className="text-sm font-semibold">
            Members ({members.length.toLocaleString()})
          </h2>
          <p className="text-xs text-muted-foreground">
            Includes members who have left. Owner first, then in join order.
          </p>
        </div>
        <MembersTable members={members} />
      </section>
    </div>
  )
}
