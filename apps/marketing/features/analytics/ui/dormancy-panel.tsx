"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { cn } from "@gorro/ui/utils"

import { dormancyByCgaColumns } from "@/features/analytics/columns/dormancy-by-cga.columns"
import { dormancyByProductColumns } from "@/features/analytics/columns/dormancy-by-product.columns"
import { winBackColumns } from "@/features/analytics/columns/win-back.columns"
import { WIN_BACK_CORRELATION_NOTE } from "@/features/analytics/constants"
import type { MarketingDormancyResponse } from "@/features/analytics/types"
import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { SectionError, SectionHeading } from "@/features/overview/ui/section"

const STATE_STYLES = {
  neverActivated: {
    label: "Never started",
    description: "No transaction ever — onboarding gap",
    card: "border-slate-500/30 bg-slate-500/5",
    bar: "bg-slate-500",
  },
  active: {
    label: "Active",
    description: "Transacted in the last 30 days",
    card: "border-emerald-500/30 bg-emerald-500/5",
    bar: "bg-emerald-600",
  },
  dormant: {
    label: "Dormant (lost)",
    description: "Transacted before, not lately",
    card: "border-amber-500/30 bg-amber-500/5",
    bar: "bg-amber-600",
  },
} as const

function StatesSummary({ data }: { data: MarketingDormancyResponse }) {
  const total =
    data.states.neverActivated +
    data.states.active +
    data.states.dormant

  const segments = [
    {
      key: "neverActivated" as const,
      value: data.states.neverActivated,
    },
    { key: "active" as const, value: data.states.active },
    { key: "dormant" as const, value: data.states.dormant },
  ]

  return (
    <div className="space-y-4">
      <div className="flex h-4 overflow-hidden rounded-full ring-1 ring-border">
        {segments.map((segment) => {
          const pct = total > 0 ? (segment.value / total) * 100 : 0
          if (pct <= 0) return null
          return (
            <div
              key={segment.key}
              className={cn("h-full", STATE_STYLES[segment.key].bar)}
              style={{ width: `${pct}%` }}
              title={`${STATE_STYLES[segment.key].label}: ${segment.value.toLocaleString()}`}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {segments.map((segment) => {
          const style = STATE_STYLES[segment.key]
          return (
            <Card key={segment.key} className={cn("ring-1", style.card)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{style.label}</CardTitle>
                <p className="text-xs text-muted-foreground">{style.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">
                  {segment.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="rounded-xl bg-muted/50 px-4 py-3 text-sm">
        <p>
          Dormancy rate among customers who have ever transacted:{" "}
          <span className="font-semibold tabular-nums">
            {data.dormancyRate}%
          </span>
          .{" "}
          <span className="text-muted-foreground">
            {data.states.neverActivated.toLocaleString()} never started (shown
            separately, not in the rate).
          </span>
        </p>
      </div>

      <p className="text-sm text-muted-foreground">{data.definition.note}</p>
      <p className="text-xs text-muted-foreground">
        Dormant after {data.definition.dormantAfterDays} days without a
        transaction. Win-back window: {data.definition.winBackWindowDays} days.
      </p>
    </div>
  )
}

export function DormancyPanel({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data: MarketingDormancyResponse | null
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  if (isLoading && !data) {
    return <Skeleton className="h-96 w-full rounded-xl" />
  }

  if (error) {
    return <SectionError error={error} onRetry={onRetry} />
  }

  if (!data) return null

  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-4">
        <SectionHeading
          title="Customer states"
          description="Three mutually exclusive states. Dormancy rate excludes never-started customers."
        />
        <StatesSummary data={data} />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="By CGA"
          description="State breakdown and dormancy rate per CGA."
        />
        <CgaSortableTable
          data={data.byCga}
          columns={dormancyByCgaColumns}
          isLoading={false}
          defaultSorting={[{ id: "dormant", desc: true }]}
          emptyMessage="No CGA breakdown available."
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="By product"
          description="Where customers sit in each product line."
        />
        <CgaSortableTable
          data={data.byProduct}
          columns={dormancyByProductColumns}
          isLoading={false}
          defaultSorting={[{ id: "dormant", desc: true }]}
          emptyMessage="No product breakdown available."
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Win-back campaigns"
          description={WIN_BACK_CORRELATION_NOTE}
        />
        <CgaSortableTable
          data={data.winBack}
          columns={winBackColumns}
          isLoading={false}
          defaultSorting={[{ id: "ratePct", desc: true }]}
          emptyMessage="No win-back campaign data."
        />
      </section>
    </div>
  )
}
