"use client"

import {
  ArrowRightLeftIcon,
  LandmarkIcon,
  PiggyBankIcon,
  ScaleIcon,
} from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"

import {
  FUNDS_IN_TRANSIT_FALLBACK_NOTE,
  RECONCILIATION_FALLBACK_NOTE,
} from "@/features/finance/constants"
import { formatKobo } from "@/features/finance/format"
import type { FinanceLiquidityResponse } from "@/features/finance/types"
import { useFinanceLiquidity } from "@/features/finance/usecases"
import {
  FinanceNote,
  FinanceSectionError,
  FinanceUnknownValue,
} from "@/features/finance/ui/finance-states"
import {
  CardGridSkeleton,
  SectionHeading,
} from "@/features/overview/ui/section"

function LiquidityCards({ data }: { data: FinanceLiquidityResponse }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnalyticsStatCard
          icon={LandmarkIcon}
          label="Excluding accrued interest"
          value={formatKobo(data.excludingAccruedInterestMinorUnits)}
          hint="Settled balances only — the leaner cash position."
        />
        <AnalyticsStatCard
          icon={ScaleIcon}
          label="Including accrued interest"
          value={formatKobo(data.includingAccruedInterestMinorUnits)}
          hint="The full liability if every customer were paid today."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnalyticsStatCard
          icon={PiggyBankIcon}
          label="Accrued, not yet paid"
          value={formatKobo(data.accruedInterestMinorUnits)}
          hint={
            <>
              Savings {formatKobo(data.breakdown.accruedSavingsMinorUnits)} ·
              Smart wallet{" "}
              {formatKobo(data.breakdown.accruedSmartWalletMinorUnits)}. Fixed
              and Target pay at maturity, so this is owed but sits in no
              balance.
            </>
          }
        />
        <AnalyticsStatCard
          icon={ArrowRightLeftIcon}
          label="Funds in transit"
          value={
            data.fundsInTransit == null ? (
              <FinanceUnknownValue label="Not tracked" />
            ) : (
              formatKobo(data.fundsInTransit)
            )
          }
          hint={
            <FinanceNote>
              {data.fundsInTransitNote || FUNDS_IN_TRANSIT_FALLBACK_NOTE}
            </FinanceNote>
          }
        />
        <AnalyticsStatCard
          icon={ScaleIcon}
          label="Reconciliation"
          value={
            data.reconciliation == null ? (
              <FinanceUnknownValue label="Not available" />
            ) : (
              <span className="text-base font-medium">Reported</span>
            )
          }
          hint={
            <FinanceNote>
              {data.reconciliationNote || RECONCILIATION_FALLBACK_NOTE}
            </FinanceNote>
          }
        />
      </div>
    </div>
  )
}

export function LiquidityPanel() {
  const { data, isLoading, error, refetch } = useFinanceLiquidity()

  return (
    <section className="space-y-4">
      <SectionHeading
        title="Liquidity"
        description="Point-in-time customer liability. Not affected by the date range."
      />
      {isLoading && !data ? <CardGridSkeleton count={2} /> : null}
      {error ? (
        <FinanceSectionError
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : null}
      {data ? <LiquidityCards data={data} /> : null}
    </section>
  )
}
