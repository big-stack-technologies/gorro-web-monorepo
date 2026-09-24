"use client"

import { useState } from "react"
import {
  AlertCircleIcon,
  Loader2Icon,
  PencilIcon,
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
import {
  bpsToPercent,
  getAjoPenaltyScopeLabel,
} from "@/features/ajo/constants"
import { EditAjoConfigDialog } from "@/features/ajo/ui/edit-ajo-config-dialog"
import { useAjoConfig } from "@/features/ajo/usecases"
import { USER_ROLE } from "@/features/users/constants"
import { cn, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

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
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
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

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}

export function AjoConfigSection() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const [editOpen, setEditOpen] = useState(false)
  const { data, isLoading, isFetching, isError, error, refetch } =
    useAjoConfig()

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
              Couldn&apos;t load Ajo settings
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
              Platform settings
            </CardTitle>
            <CardDescription>
              {isSuperAdmin
                ? "Defaults for new Ajo groups. Edits apply immediately."
                : "Read-only view. Only super admins can change settings."}
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <PencilIcon data-icon="inline-start" />
                Edit
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ConfigRow
            label="Minimum contribution"
            value={formatCurrencyAmount(data.minContributionNaira)}
          />
          <ConfigRow
            label="Max slots per group"
            value={String(data.maxSlotsPerGroup)}
          />
          <ConfigRow
            label="Max slots per member"
            value={String(data.maxSlotsPerMember)}
          />
          <ConfigRow
            label="Penalty rate"
            value={`${bpsToPercent(data.penaltyPercentBps)}%`}
          />
          <ConfigRow
            label="Penalty min"
            value={formatCurrencyAmount(data.penaltyMinNaira)}
          />
          <ConfigRow
            label="Penalty max"
            value={formatCurrencyAmount(data.penaltyMaxNaira)}
          />
          <ConfigRow
            label="Grace window"
            value={`${data.graceWindowHours} hours`}
          />
          <ConfigRow
            label="Penalty scope"
            value={getAjoPenaltyScopeLabel(data.penaltyScope)}
          />
          <p className="col-span-full text-xs text-muted-foreground">
            Last updated {formatDateTime(data.updatedAt)}
          </p>
        </CardContent>
      </Card>

      {isSuperAdmin ? (
        <EditAjoConfigDialog
          config={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </>
  )
}
