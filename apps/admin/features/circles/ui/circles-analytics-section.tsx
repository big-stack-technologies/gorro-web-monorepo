"use client"

import {
  BanknoteIcon,
  CircleDashedIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { CIRCLE_CURRENCY } from "@/features/circles/constants"
import { CircleAnalyticsError } from "@/features/circles/ui/circle-analytics-error"
import { CircleFunnelCard } from "@/features/circles/ui/circle-funnel-card"
import { CircleGrowthCard } from "@/features/circles/ui/circle-growth-card"
import { useCirclesOverview } from "@/features/circles/usecases"
import { formatCurrencyAmount } from "@gorro/ui/utils"

function OverviewTiles() {
  const overview = useCirclesOverview()

  if (overview.isLoading && !overview.data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (overview.isError || !overview.data) {
    return (
      <CircleAnalyticsError
        title="Circle overview unavailable"
        error={overview.error}
        fallback="Could not load the circle overview."
        onRetry={() => overview.refetch()}
      />
    )
  }

  const { circlesByStatus, circlesByVisibility, members } = overview.data

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsStatCard
        icon={CircleDashedIcon}
        label="Circles"
        value={circlesByStatus.total.toLocaleString()}
        hint={
          <>
            {circlesByStatus.active.toLocaleString()} active ·{" "}
            {circlesByStatus.completed.toLocaleString()} completed ·{" "}
            {circlesByStatus.cancelled.toLocaleString()} cancelled
            <br />
            {circlesByVisibility.public.toLocaleString()} public ·{" "}
            {circlesByVisibility.private.toLocaleString()} private
          </>
        }
      />
      <AnalyticsStatCard
        icon={UsersRoundIcon}
        label="Active members"
        value={members.active.toLocaleString()}
        hint={`${members.left.toLocaleString()} left · ${members.pendingJoin.toLocaleString()} pending · ${members.declined.toLocaleString()} declined`}
      />
      <AnalyticsStatCard
        icon={UsersIcon}
        label="Distinct customers"
        value={overview.data.distinctCustomers.toLocaleString()}
        hint={`${members.total.toLocaleString()} memberships in total — one customer can be in several circles`}
      />
      <AnalyticsStatCard
        icon={BanknoteIcon}
        label="Total saved"
        value={formatCurrencyAmount(
          overview.data.totalAumNaira,
          CIRCLE_CURRENCY
        )}
        hint={`${overview.data.fundedMembers.toLocaleString()} funded members · ${formatCurrencyAmount(overview.data.totalAccruedInterestNaira, CIRCLE_CURRENCY)} accrued interest`}
      />
    </div>
  )
}

/**
 * The funnel leads: with a handful of naira on the platform, the gap between
 * joining and funding is the interesting number, not AUM.
 */
export function CirclesAnalyticsSection() {
  return (
    <section className="flex flex-col gap-4" aria-label="Circle analytics">
      <CircleFunnelCard />
      <OverviewTiles />
      <CircleGrowthCard />
    </section>
  )
}
