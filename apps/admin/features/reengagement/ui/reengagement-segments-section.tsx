"use client"

import { useCallback } from "react"
import {
  AlertCircleIcon,
  Loader2Icon,
  RefreshCwIcon,
  UsersRoundIcon,
} from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
import { DataTable } from "@gorro/ui/components/data-table"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import { listSegmentUsersAction } from "@/features/reengagement/actions"
import { segmentUsersColumns } from "@/features/reengagement/columns"
import {
  getReengagementCampaignLabel,
  REENGAGEMENT_CAMPAIGNS,
} from "@/features/reengagement/constants"
import type { ReengagementCampaign } from "@/features/reengagement/types"
import { useReengagementSegments } from "@/features/reengagement/usecases"
import { QUERY_KEYS } from "@/lib/query-keys"
import type { PaginatedListQueryParams } from "@gorro/api/types/paginated-list"
import { cn, formatDateTime } from "@gorro/ui/utils"

function SegmentUsersTable({ campaign }: { campaign: ReengagementCampaign }) {
  const fetchData = useCallback(
    (params: PaginatedListQueryParams) =>
      listSegmentUsersAction(campaign, params),
    [campaign]
  )

  return (
    <DataTable
      columns={segmentUsersColumns}
      fetchData={fetchData}
      queryKey={QUERY_KEYS.reengagement.segmentUsers(campaign)}
      paginationNamespace={`segment-${campaign.toLowerCase()}`}
      emptyMessage="No users currently in this segment."
    />
  )
}

export function ReengagementSegmentsSection() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useReengagementSegments()

  if (isLoading && !data) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-xl border border-destructive/25 bg-destructive/6 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircleIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-destructive">
              Couldn&apos;t load segment snapshot
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <section
      className={cn(
        "flex flex-col gap-4 transition-opacity duration-200",
        isFetching && "opacity-[0.88]"
      )}
      aria-label="Re-engagement segments"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={data.masterEnabled ? "default" : "secondary"}>
            {data.masterEnabled ? "Master enabled" : "Master disabled"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Snapshot {formatDateTime(data.generatedAt)}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refresh segments"
        >
          {isFetching ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <RefreshCwIcon className="size-3.5" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {data.segments.map((segment) => (
          <AnalyticsStatCard
            key={segment.campaign}
            icon={UsersRoundIcon}
            label={getReengagementCampaignLabel(segment.campaign)}
            value={segment.usersInSegment.toLocaleString()}
            hint={
              <>
                <span className="block">
                  Due now: {segment.dueNow.toLocaleString()}
                </span>
                <span className="block">
                  {segment.schedule} · cap {segment.lifetimeCap}
                </span>
                <span className="block">
                  {segment.enabled ? "Enabled" : "Disabled"}
                </span>
              </>
            }
          />
        ))}
      </div>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Segment users
          </CardTitle>
          <CardDescription>
            Users currently targeted by each campaign, with due-now users listed
            first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={REENGAGEMENT_CAMPAIGNS[0]} className="gap-4">
            <TabsList className="h-9 w-fit justify-start">
              {REENGAGEMENT_CAMPAIGNS.map((campaign) => (
                <TabsTrigger
                  key={campaign}
                  value={campaign}
                  className="flex-none text-xs sm:text-sm"
                >
                  {getReengagementCampaignLabel(campaign)}
                </TabsTrigger>
              ))}
            </TabsList>
            {REENGAGEMENT_CAMPAIGNS.map((campaign) => (
              <TabsContent key={campaign} value={campaign} className="mt-0">
                <SegmentUsersTable campaign={campaign} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
