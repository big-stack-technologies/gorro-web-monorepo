"use client"

import { useState } from "react"
import {
  AlertCircleIcon,
  Loader2Icon,
  PencilIcon,
  PlayIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { getReengagementCampaignLabel } from "@/features/reengagement/constants"
import { EditReengagementConfigDialog } from "@/features/reengagement/ui/edit-reengagement-config-dialog"
import { RunReengagementDialog } from "@/features/reengagement/ui/run-reengagement-dialog"
import { useReengagementConfig } from "@/features/reengagement/usecases"
import { USER_ROLE } from "@/features/users/constants"
import { cn, formatDateTime } from "@gorro/ui/utils"

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function ConfigSkeleton() {
  return (
    <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 px-3 py-2"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
        <Skeleton className="col-span-full h-3 w-44" />
      </CardContent>
    </Card>
  )
}

function enabledLabel(value: boolean) {
  return value ? "Enabled" : "Disabled"
}

export function ReengagementConfigSection() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const [editOpen, setEditOpen] = useState(false)
  const [runOpen, setRunOpen] = useState(false)
  const { data, isLoading, isFetching, isError, error, refetch } =
    useReengagementConfig()

  if (isLoading) {
    return <ConfigSkeleton />
  }

  if (isError) {
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
              Couldn&apos;t load re-engagement settings
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

  if (!data) {
    return null
  }

  return (
    <>
      <Card
        className={cn(
          "border-border/80 shadow-sm ring-1 ring-border/40 transition-opacity duration-200",
          isFetching && "opacity-[0.88]"
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          <div className="space-y-1">
            <CardTitle className="font-heading text-base">
              Campaign settings
            </CardTitle>
            <CardDescription>
              {isSuperAdmin
                ? "Master switch, per-campaign toggles, channels, and daily send hour."
                : "Read-only view. Only super admins can change settings or run campaigns."}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isFetching ? (
              <Loader2Icon
                className="size-3.5 shrink-0 animate-spin text-muted-foreground"
                aria-hidden
              />
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh settings"
            >
              <RefreshCwIcon
                className={cn("size-3.5", isFetching && "animate-spin")}
              />
            </Button>
            {isSuperAdmin ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRunOpen(true)}
                >
                  <PlayIcon data-icon="inline-start" />
                  Run now
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  <PencilIcon data-icon="inline-start" />
                  Edit
                </Button>
              </>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ConfigRow label="Master" value={enabledLabel(data.masterEnabled)} />
          <ConfigRow
            label="Send hour (WAT)"
            value={`${data.sendHour}:00`}
          />
          <ConfigRow
            label={getReengagementCampaignLabel("COMPLETE_KYC")}
            value={enabledLabel(data.kycReminderEnabled)}
          />
          <ConfigRow
            label={getReengagementCampaignLabel("START_SAVING")}
            value={enabledLabel(data.firstSaveReminderEnabled)}
          />
          <ConfigRow
            label={getReengagementCampaignLabel("REFER_EARN")}
            value={enabledLabel(data.referEarnReminderEnabled)}
          />
          <ConfigRow label="Push" value={enabledLabel(data.pushEnabled)} />
          <ConfigRow label="Email" value={enabledLabel(data.emailEnabled)} />
          <p className="col-span-full text-xs text-muted-foreground">
            Last updated {formatDateTime(data.updatedAt)}
          </p>
        </CardContent>
      </Card>

      {isSuperAdmin ? (
        <>
          <EditReengagementConfigDialog
            config={data}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <RunReengagementDialog open={runOpen} onOpenChange={setRunOpen} />
        </>
      ) : null}
    </>
  )
}
