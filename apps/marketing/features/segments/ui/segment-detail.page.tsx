"use client"

import * as React from "react"
import Link from "next/link"
import { DownloadIcon, Loader2Icon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import { DataTable } from "@gorro/ui/components/data-table"

import {
  exportSegmentCsvAction,
  getSegmentUsersAction,
} from "@/features/segments/actions"
import { createSegmentUsersColumns } from "@/features/segments/columns/segment-users.columns"
import { useSegmentThresholdParams } from "@/features/segments/hooks/use-segment-threshold-params"
import type { MarketingSegmentKey } from "@/features/segments/types"
import { SegmentThresholdControls } from "@/features/segments/ui/segment-threshold-controls"
import { useCsvDownload } from "@/features/marketing-export/usecases/use-csv-download"
import { SectionHeading } from "@/features/overview/ui/section"
import { QUERY_KEYS } from "@/lib/query-keys"
import { routes } from "@/lib/routes"

const SEGMENT_LABELS: Record<MarketingSegmentKey, string> = {
  "no-kyc": "No KYC",
  "kyc-no-deposit": "KYC, no deposit",
  "emptied-and-gone": "Emptied and gone",
  "money-still-in": "Money still in",
  "ajo-stalled": "Ajo stalled",
}

export function SegmentDetailPage({ segmentKey }: { segmentKey: string }) {
  const key = segmentKey as MarketingSegmentKey
  const { options, setOptions } = useSegmentThresholdParams()
  const { download, isPending } = useCsvDownload()

  const columns = React.useMemo(
    () =>
      createSegmentUsersColumns({ showAjoGroup: key === "ajo-stalled" }),
    [key]
  )

  const listHref = React.useMemo(() => {
    const params = new URLSearchParams({
      minDaysSinceSignup: options.minDaysSinceSignup,
      inactiveDays: options.inactiveDays,
      nearZeroBalance: options.nearZeroBalance,
    })
    return `${routes.segments.list}?${params.toString()}`
  }, [options])

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title={SEGMENT_LABELS[key] ?? segmentKey}
          description="Paginated people matching the segment rules and thresholds below."
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={listHref}>Back to segments</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() =>
              void download(() => exportSegmentCsvAction(key, options))
            }
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <DownloadIcon />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      <SegmentThresholdControls
        options={options}
        onApply={(next) => setOptions(next)}
      />

      <section className="flex flex-col gap-4">
        <SectionHeading title="People in segment" />
        <DataTable
          columns={columns}
          fetchData={(params) => getSegmentUsersAction(key, options, params)}
          queryKey={QUERY_KEYS.segments.users(key, options)}
          initialPageSize={50}
          pageSizeOptions={[20, 50, 100, 200]}
          emptyMessage="No users match this segment with the current thresholds."
        />
      </section>
    </div>
  )
}
