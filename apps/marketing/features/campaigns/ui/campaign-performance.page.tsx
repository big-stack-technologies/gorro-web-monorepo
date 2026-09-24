"use client"

import * as React from "react"
import Link from "next/link"
import { PencilIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { formatNgn, formatUtcDate } from "@gorro/ui/utils"

import { CampaignFormDialog } from "@/features/campaigns/ui/campaign-form-dialog"
import { useCampaignPerformance } from "@/features/campaigns/usecases"
import {
  CardGridSkeleton,
  SectionError,
  SectionHeading,
} from "@/features/overview/ui/section"
import { routes } from "@/lib/routes"

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: React.ReactNode
  hint?: string
}) {
  return (
    <Card className="ring-1 ring-foreground/10">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  )
}

export function CampaignPerformancePage({ id }: { id: string }) {
  const [editOpen, setEditOpen] = React.useState(false)
  const performance = useCampaignPerformance(id)

  if (performance.isLoading) {
    return (
      <div className="px-4 pb-8 lg:px-6">
        <CardGridSkeleton count={8} />
      </div>
    )
  }

  if (performance.isError || !performance.data) {
    return (
      <div className="px-4 pb-8 lg:px-6">
        <SectionError
          error={performance.error}
          onRetry={() => void performance.refetch()}
        />
      </div>
    )
  }

  const data = performance.data

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title={data.name}
          description={`${formatUtcDate(data.startsOn)} – ${formatUtcDate(data.endsOn)}${
            data.territory ? ` · ${data.territory.name}` : ""
          }`}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={routes.campaigns.list}>Back to campaigns</Link>
          </Button>
          <Button type="button" size="sm" onClick={() => setEditOpen(true)}>
            <PencilIcon />
            Edit
          </Button>
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-4 ring-1 ring-amber-500/20">
        <SectionHeading
          title="Attribution (window, not causation)"
          description={data.attributionNote}
        />
        {data.overlapsWith.length > 0 ? (
          <div className="text-sm">
            <p className="font-medium text-foreground">Overlapping campaigns</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {data.overlapsWith.map((overlap) => (
                <li key={overlap.id}>
                  {overlap.name} ({formatUtcDate(overlap.startsOn)} –{" "}
                  {formatUtcDate(overlap.endsOn)})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No overlapping campaigns in this window.
          </p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Leads generated"
          value={data.leadsGenerated.toLocaleString()}
          hint="From field reports in the attribution window."
        />
        <MetricCard
          label="Signups"
          value={data.signups.toLocaleString()}
        />
        <MetricCard
          label="KYC completed"
          value={data.kycCompleted.toLocaleString()}
        />
        <MetricCard
          label="First deposits"
          value={data.firstDeposits.toLocaleString()}
        />
        <MetricCard
          label="Product adoption"
          value={data.productAdoption.toLocaleString()}
        />
        <MetricCard
          label="Clusters created"
          value={data.clustersCreated.toLocaleString()}
        />
        <MetricCard
          label="Transactions"
          value={data.transactions.toLocaleString()}
        />
        <MetricCard label="GTV" value={formatNgn(data.gtv)} />
        <MetricCard
          label="Signup → deposit"
          value={`${data.signupToDepositPct.toFixed(1)}%`}
        />
        <MetricCard
          label="Cost per signup"
          value={
            data.costPerSignup != null
              ? formatNgn(data.costPerSignup)
              : "—"
          }
        />
        <MetricCard
          label="Cost per first deposit"
          value={
            data.costPerFirstDeposit != null
              ? formatNgn(data.costPerFirstDeposit)
              : "—"
          }
          hint="Primary efficiency metric when spend is tracked — first-deposit cost matters more than signup cost."
        />
        <MetricCard
          label="Campaign cost"
          value={data.cost != null ? formatNgn(data.cost) : "—"}
        />
      </section>

      <CampaignFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        campaign={data}
      />
    </div>
  )
}
