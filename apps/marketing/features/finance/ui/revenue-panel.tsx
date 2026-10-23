"use client"

import { HourglassIcon, PercentIcon, WalletIcon } from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"

import {
  FLOAT_SPREAD_FALLBACK_NOTE,
  PENDING_FALLBACK_NOTE,
} from "@/features/finance/constants"
import {
  formatFinanceLabel,
  formatFinanceRange,
  formatKobo,
} from "@/features/finance/format"
import type {
  FinancePeriodFilters,
  FinanceRevenueResponse,
} from "@/features/finance/types"
import { useFinanceRevenue } from "@/features/finance/usecases"
import {
  FinanceNote,
  FinanceSectionError,
  FinanceUnknownValue,
} from "@/features/finance/ui/finance-states"
import { SectionHeading } from "@/features/overview/ui/section"

function AmountRow({
  label,
  detail,
  minorUnits,
}: {
  label: string
  detail?: string
  minorUnits: number
}) {
  return (
    <li className="flex items-baseline justify-between gap-4 py-2 text-sm">
      <span>
        {label}
        {detail ? (
          <span className="ml-2 text-xs text-muted-foreground">{detail}</span>
        ) : null}
      </span>
      <span className="font-medium tabular-nums">{formatKobo(minorUnits)}</span>
    </li>
  )
}

function RevenueContent({ data }: { data: FinanceRevenueResponse }) {
  const pendingTotal = data.pending.reduce(
    (sum, row) => sum + row.minorUnits,
    0
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnalyticsStatCard
          icon={WalletIcon}
          label="Realised revenue"
          value={formatKobo(data.totalRealisedMinorUnits)}
          hint={`${formatFinanceRange(data)}. Settled fees only.`}
        />
        <AnalyticsStatCard
          icon={PercentIcon}
          label="Float spread"
          value={
            data.floatSpread == null ? (
              <FinanceUnknownValue label="Not instrumented" />
            ) : (
              formatKobo(data.floatSpread)
            )
          }
          hint={
            <FinanceNote>
              {data.floatSpreadNote || FLOAT_SPREAD_FALLBACK_NOTE}
            </FinanceNote>
          }
        />
        <AnalyticsStatCard
          icon={HourglassIcon}
          label="Pipeline — not revenue"
          value={formatKobo(pendingTotal)}
          hint={
            <FinanceNote>{data.pendingNote || PENDING_FALLBACK_NOTE}</FinanceNote>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Realised revenue breakdown
            </CardTitle>
            <CardDescription>
              Sums to the realised revenue total above.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="divide-y">
              <AmountRow
                label="Wallet & transfer fees"
                detail={`${data.walletAndTransferFees.count.toLocaleString()} fees`}
                minorUnits={data.walletAndTransferFees.minorUnits}
              />
              {data.productFees.map((fee) => (
                <AmountRow
                  key={fee.account}
                  label={fee.account}
                  minorUnits={fee.minorUnits}
                />
              ))}
              <li className="flex items-baseline justify-between gap-4 pt-3 text-sm font-semibold">
                <span>Total realised</span>
                <span className="tabular-nums">
                  {formatKobo(data.totalRealisedMinorUnits)}
                </span>
              </li>
            </ul>
            <FinanceNote>{data.walletAndTransferFees.note}</FinanceNote>
          </CardContent>
        </Card>

        <Card className="border-dashed ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Awaiting settlement
            </CardTitle>
            <CardDescription>
              Charged but not posted. Excluded from revenue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing pending in this range.
              </p>
            ) : (
              <ul className="divide-y">
                {data.pending.map((row) => (
                  <AmountRow
                    key={row.status}
                    label={formatFinanceLabel(row.status)}
                    detail={`${row.count.toLocaleString()} fees`}
                    minorUnits={row.minorUnits}
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function RevenuePanel({ filters }: { filters: FinancePeriodFilters }) {
  const { data, isLoading, error, refetch } = useFinanceRevenue(filters)

  return (
    <section className="space-y-4">
      <SectionHeading
        title="Revenue"
        description="Settled fee revenue. Pending fees are pipeline and are never added to the total."
      />
      {isLoading && !data ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : null}
      {error ? (
        <FinanceSectionError
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : null}
      {data && !error ? <RevenueContent data={data} /> : null}
    </section>
  )
}
