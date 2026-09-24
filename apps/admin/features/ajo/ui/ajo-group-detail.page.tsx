"use client"

import { useState, type ComponentType, type ReactNode } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  HandCoinsIcon,
  RefreshCwIcon,
  TargetIcon,
  UsersRoundIcon,
  XCircleIcon,
} from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@gorro/ui/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gorro/ui/components/ui/tabs"
import {
  AJO_CURRENCY,
  getAjoFrequencyLabel,
  getAjoGroupTypeLabel,
} from "@/features/ajo/constants"
import { CloseAjoGroupDialog } from "@/features/ajo/ui/close-ajo-group-dialog"
import { AjoGroupStatusBadge } from "@/features/ajo/ui/ajo-group-status-badge"
import { AjoMembersTable } from "@/features/ajo/ui/ajo-members-table"
import { useAjoGroup } from "@/features/ajo/usecases"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { USER_ROLE } from "@/features/users/constants"
import { routes } from "@/lib/routes"
import { emptyAsNa, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
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

export function AjoGroupDetailPage({ groupId }: { groupId: string }) {
  const groupQuery = useAjoGroup(groupId)
  const { data: profile } = useGetProfile()
  const [closeOpen, setCloseOpen] = useState(false)

  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  if (groupQuery.isLoading && !groupQuery.data) {
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

  if (groupQuery.isError || !groupQuery.data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-destructive">
          {groupQuery.error instanceof Error
            ? groupQuery.error.message
            : "Could not load Ajo group details."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => groupQuery.refetch()}
        >
          <RefreshCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </div>
    )
  }

  const group = groupQuery.data
  const canClose =
    isSuperAdmin &&
    group.status !== "CANCELLED" &&
    group.status !== "COMPLETED"
  const initials = group.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
        <Link href={routes.protected.ajo.base}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to groups
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="size-11">
            {group.imageUrl ? (
              <AvatarImage src={group.imageUrl} alt="" />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <AdminPageHeader title={group.name} description={group.code} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AjoGroupStatusBadge status={group.status} />
              <Badge variant="outline">
                {getAjoGroupTypeLabel(group.type)}
              </Badge>
              {group.randomised ? (
                <Badge variant="outline">Randomised</Badge>
              ) : null}
            </div>
          </div>
        </div>
        {canClose ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setCloseOpen(true)}
          >
            <XCircleIcon data-icon="inline-start" />
            Close group
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Pool balance"
          value={formatCurrencyAmount(group.poolBalance, AJO_CURRENCY)}
          icon={BanknoteIcon}
        />
        <MetricCard
          label="Amount contributed"
          value={formatCurrencyAmount(group.amountContributed, AJO_CURRENCY)}
          icon={HandCoinsIcon}
        />
        <MetricCard
          label="Amount expected"
          value={formatCurrencyAmount(group.amountExpected, AJO_CURRENCY)}
          icon={TargetIcon}
        />
        <MetricCard
          label="Slots filled"
          value={`${group.slotsFilled}/${group.slotsTotal}`}
          icon={UsersRoundIcon}
        />
        <MetricCard
          label="Members"
          value={group.members.length.toLocaleString()}
          icon={UsersRoundIcon}
        />
        <MetricCard
          label="Penalty amount"
          value={formatCurrencyAmount(group.penaltyAmount, AJO_CURRENCY)}
          icon={HandCoinsIcon}
        />
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="cycle">Current cycle</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Group information</CardTitle>
              <CardDescription>
                Schedule, organiser details, and rotation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
              <dl className="flex flex-col gap-4">
                <DetailField label="Organiser" value={group.organiserName} />
                <DetailField
                  label="Description"
                  value={emptyAsNa(group.description)}
                />
                <DetailField
                  label="Contribution"
                  value={formatCurrencyAmount(
                    group.contributionAmount,
                    AJO_CURRENCY
                  )}
                />
                <DetailField
                  label="Frequency"
                  value={getAjoFrequencyLabel(group.frequency)}
                />
                <DetailField
                  label="Contribution day"
                  value={emptyAsNa(group.contributionDayLabel)}
                />
                <DetailField
                  label="Payout day"
                  value={emptyAsNa(group.payoutDayLabel)}
                />
              </dl>
              <dl className="flex flex-col gap-4">
                <DetailField
                  label="Start date"
                  value={formatDateTime(group.startDate)}
                />
                <DetailField
                  label="End date"
                  value={
                    group.endDate ? formatDateTime(group.endDate) : "N/A"
                  }
                />
                <DetailField
                  label="Slot order"
                  value={group.slotOrderMode.replace(/_/g, " ")}
                />
                <DetailField
                  label="Per-member slot cap"
                  value={group.perMemberSlotCap}
                />
                <DetailField
                  label="Current cycle"
                  value={group.currentCycleNumber.toLocaleString()}
                />
                <DetailField
                  label="Closed at"
                  value={
                    group.closedAt ? formatDateTime(group.closedAt) : "N/A"
                  }
                />
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
              <CardDescription>
                Slots held, contributions, defaults, and flags for each member.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AjoMembersTable
                groupId={group.id}
                groupStatus={group.status}
                members={group.members}
                canRemove={isSuperAdmin}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Current cycle</CardTitle>
              <CardDescription>
                Due date, status, and recipient for the active rotation cycle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-4">
                <DetailField
                  label="Cycle number"
                  value={emptyAsNa(
                    group.currentCycle.cycleNumber?.toLocaleString() ?? null
                  )}
                />
                <DetailField
                  label="Due date"
                  value={
                    group.currentCycle.dueDate
                      ? formatDateTime(group.currentCycle.dueDate)
                      : "N/A"
                  }
                />
                <DetailField
                  label="Status"
                  value={emptyAsNa(group.currentCycle.cycleStatus)}
                />
                <DetailField
                  label="Recipient"
                  value={emptyAsNa(group.currentCycle.recipient)}
                />
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {canClose ? (
        <CloseAjoGroupDialog
          groupId={group.id}
          groupName={group.name}
          open={closeOpen}
          onOpenChange={setCloseOpen}
        />
      ) : null}
    </div>
  )
}
