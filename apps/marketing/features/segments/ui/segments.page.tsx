"use client"

import { useRouter } from "next/navigation"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { formatNgn } from "@gorro/ui/utils"
import { cn } from "@gorro/ui/utils"

import { useSegmentThresholdParams } from "@/features/segments/hooks/use-segment-threshold-params"
import type { MarketingSegmentSummary } from "@/features/segments/types"
import { SegmentThresholdControls } from "@/features/segments/ui/segment-threshold-controls"
import { useSegmentsSummary } from "@/features/segments/usecases/use-segments-summary"
import {
  SectionError,
  SectionHeading,
  CardGridSkeleton,
} from "@/features/overview/ui/section"
import { routes } from "@/lib/routes"

function SegmentCard({ segment }: { segment: MarketingSegmentSummary }) {
  return (
    <Card
      className={cn(
        "h-full transition-colors hover:bg-muted/40",
        "ring-1 ring-foreground/10"
      )}
    >
      <CardHeader>
        <CardTitle className="text-base">{segment.label}</CardTitle>
        <CardDescription>{segment.description}</CardDescription>
        <p className="pt-2 text-3xl font-semibold tabular-nums tracking-tight">
          {segment.count.toLocaleString()}
        </p>
        {segment.totalBalance != null ? (
          <p className="text-sm text-muted-foreground">
            Total balance {formatNgn(segment.totalBalance)}
          </p>
        ) : null}
      </CardHeader>
    </Card>
  )
}

export function SegmentsPage() {
  const router = useRouter()
  const { options, setOptions } = useSegmentThresholdParams()
  const summary = useSegmentsSummary(options)

  const buildDetailHref = (key: string) => {
    const params = new URLSearchParams({
      minDaysSinceSignup: options.minDaysSinceSignup,
      inactiveDays: options.inactiveDays,
      nearZeroBalance: options.nearZeroBalance,
    })
    return `${routes.segments.detail(key)}?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Outreach segments"
        description="Live call-list sizes with shared thresholds. Drill down for paginated people or CSV export."
      />

      <SegmentThresholdControls
        options={options}
        onApply={(next) => setOptions(next)}
      />

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Call lists"
          description={
            summary.data
              ? `${summary.data.totalUsers.toLocaleString()} total users across segments (users may appear in multiple lists).`
              : "Loading segment sizes…"
          }
        />
        {summary.isError ? (
          <SectionError
            error={summary.error}
            onRetry={() => void summary.refetch()}
          />
        ) : summary.isLoading ? (
          <CardGridSkeleton count={5} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(summary.data?.segments ?? []).map((segment) => (
              <div
                key={segment.key}
                role="link"
                tabIndex={0}
                onClick={() => router.push(buildDetailHref(segment.key))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    router.push(buildDetailHref(segment.key))
                  }
                }}
              >
                <SegmentCard segment={segment} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
