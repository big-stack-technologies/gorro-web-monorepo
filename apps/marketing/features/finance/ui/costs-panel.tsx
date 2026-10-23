"use client"

import { CreditCardIcon, FingerprintIcon, ReceiptIcon } from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"

import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import {
  kycCheckColumns,
  processorCostColumns,
} from "@/features/finance/columns/finance-costs.columns"
import { formatFinanceRange, formatKobo } from "@/features/finance/format"
import type {
  FinanceCostsResponse,
  FinancePeriodFilters,
} from "@/features/finance/types"
import { useFinanceCosts } from "@/features/finance/usecases"
import {
  FinanceNote,
  FinanceSectionError,
} from "@/features/finance/ui/finance-states"
import { SectionHeading } from "@/features/overview/ui/section"

function identityHint(data: FinanceCostsResponse) {
  const { checks, successful } = data.identityVerification
  const failed = checks - successful
  const volume = `${successful.toLocaleString()} of ${checks.toLocaleString()} BVN checks successful`
  if (checks === 0 || failed <= 0) return `${volume}.`
  const failureRate = Math.round((failed / checks) * 100)
  return `${volume} (${failureRate}% failed, billed at zero).`
}

function CostsContent({ data }: { data: FinanceCostsResponse }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnalyticsStatCard
          icon={ReceiptIcon}
          label="Total cost"
          value={formatKobo(data.totalCostMinorUnits)}
          hint={
            <div className="space-y-1">
              <p>{formatFinanceRange(data)}.</p>
              <FinanceNote>{data.totalCostNote}</FinanceNote>
            </div>
          }
        />
        <AnalyticsStatCard
          icon={CreditCardIcon}
          label="Interest paid to customers"
          value={formatKobo(data.interestPaidMinorUnits)}
        />
        <AnalyticsStatCard
          icon={FingerprintIcon}
          label="Identity verification"
          value={formatKobo(data.identityVerification.minorUnits)}
          hint={
            <div className="space-y-1">
              <p>{identityHint(data)}</p>
              <FinanceNote>{data.identityVerificationNote}</FinanceNote>
            </div>
          }
        />
      </div>

      <div className="space-y-3">
        <SectionHeading
          title="Processor charges"
          description="Fees charged by each payment rail."
        />
        <CgaSortableTable
          data={data.processors}
          columns={processorCostColumns}
          isLoading={false}
          defaultSorting={[{ id: "minorUnits", desc: true }]}
          emptyMessage="No processor charges in this range."
        />
        <FinanceNote>{data.processorNote}</FinanceNote>
      </div>

      <div className="space-y-3">
        <SectionHeading
          title="KYC check volume"
          description="NIN and address checks behind the KYC tiers. Volume only — no cost is applied."
        />
        <CgaSortableTable
          data={data.kycChecks}
          columns={kycCheckColumns}
          isLoading={false}
          defaultSorting={[{ id: "checks", desc: true }]}
          emptyMessage="No KYC checks in this range."
        />
        <FinanceNote>{data.kycChecksNote}</FinanceNote>
      </div>
    </div>
  )
}

export function CostsPanel({ filters }: { filters: FinancePeriodFilters }) {
  const { data, isLoading, error, refetch } = useFinanceCosts(filters)

  return (
    <section className="space-y-4">
      <SectionHeading
        title="Costs"
        description="Processor charges, interest paid and identity checks."
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
      {data && !error ? <CostsContent data={data} /> : null}
    </section>
  )
}
