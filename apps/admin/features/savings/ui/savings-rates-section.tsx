"use client"

import { useState } from "react"
import {
  AlertCircleIcon,
  Loader2Icon,
  PencilIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Checkbox } from "@gorro/ui/components/ui/checkbox"
import { Label } from "@gorro/ui/components/ui/label"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import {
  getSavingsProductTypeLabel,
  SAVINGS_CURRENCY,
} from "@/features/savings/constants"
import type {
  SavingsFixedRateBand,
  SavingsProductType,
  SavingsRateConfig,
} from "@/features/savings/types"
import { EditFixedBandDialog } from "@/features/savings/ui/edit-fixed-band-dialog"
import { EditTierRateDialog } from "@/features/savings/ui/edit-tier-rate-dialog"
import { EditWhtDialog } from "@/features/savings/ui/edit-wht-dialog"
import {
  useFixedRateBands,
  useSavingsRates,
  useUpdateSavingsRate,
  useWhtConfig,
} from "@/features/savings/usecases"
import { USER_ROLE } from "@/features/users/constants"
import { cn, formatCurrencyAmount } from "@gorro/ui/utils"

const TIER_PRODUCTS: SavingsProductType[] = ["TARGET", "VAULT"]

function RatesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
}

function TierRateCard({
  config,
  canEdit,
}: {
  config: SavingsRateConfig
  canEdit: boolean
}) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <div>
            <CardTitle className="font-heading text-base">
              {getSavingsProductTypeLabel(config.productType)}
            </CardTitle>
            <CardDescription>Two-tier interest rates</CardDescription>
          </div>
          {canEdit ? (
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
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tier 1</span>
            <span className="font-medium tabular-nums">
              {config.tier1RatePercent}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tier 2</span>
            <span className="font-medium tabular-nums">
              {config.tier2RatePercent}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Threshold</span>
            <span className="font-medium tabular-nums">
              {formatCurrencyAmount(
                config.tierThresholdNaira,
                SAVINGS_CURRENCY
              )}
            </span>
          </div>
        </CardContent>
      </Card>
      {canEdit ? (
        <EditTierRateDialog
          config={config}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </>
  )
}

function FixedAvailabilityCard({
  config,
  canEdit,
}: {
  config: SavingsRateConfig | undefined
  canEdit: boolean
}) {
  const mutation = useUpdateSavingsRate("FIXED")
  const enabled = config?.isEnabled ?? false

  const handleToggle = (checked: boolean) => {
    if (!canEdit) return
    mutation.mutate({ isEnabled: checked })
  }

  return (
    <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base">Fixed savings</CardTitle>
        <CardDescription>
          Toggle product availability. Fixed interest rates are managed via
          duration bands below — tier rates on this config are ignored.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="fixed-enabled"
            checked={enabled}
            disabled={!canEdit || mutation.isPending}
            onCheckedChange={(checked) => handleToggle(checked === true)}
          />
          <Label htmlFor="fixed-enabled" className="font-normal">
            Product enabled
          </Label>
        </div>
        <Badge variant={enabled ? "default" : "secondary"}>
          {enabled ? "Available" : "Coming soon"}
        </Badge>
      </CardContent>
    </Card>
  )
}

function FixedBandsTable({
  bands,
  canEdit,
}: {
  bands: SavingsFixedRateBand[]
  canEdit: boolean
}) {
  const [editingBand, setEditingBand] = useState<SavingsFixedRateBand | null>(
    null
  )

  return (
    <>
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base">
            Fixed rate bands
          </CardTitle>
          <CardDescription>
            Authoritative rates by lock-in duration. Changes are not
            retroactive.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                {canEdit ? <TableHead className="w-20" /> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bands.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canEdit ? 4 : 3}
                    className="text-center text-muted-foreground"
                  >
                    No bands configured
                  </TableCell>
                </TableRow>
              ) : (
                bands.map((band) => (
                  <TableRow key={band.id}>
                    <TableCell className="font-medium tabular-nums">
                      {band.minDays}–{band.maxDays} days
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {band.ratePercent}%
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {new Date(band.updatedAt).toLocaleDateString()}
                    </TableCell>
                    {canEdit ? (
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Edit band"
                          onClick={() => setEditingBand(band)}
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {editingBand && canEdit ? (
        <EditFixedBandDialog
          band={editingBand}
          open={!!editingBand}
          onOpenChange={(open) => {
            if (!open) setEditingBand(null)
          }}
        />
      ) : null}
    </>
  )
}

function WhtCard({
  canEdit,
}: {
  canEdit: boolean
}) {
  const [editOpen, setEditOpen] = useState(false)
  const { data: wht, isLoading, isError, error, refetch } = useWhtConfig()

  if (isLoading) {
    return <Skeleton className="h-36 rounded-xl" />
  }

  if (isError || !wht) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-xl border border-destructive/25 bg-destructive/6 p-4"
      >
        <p className="text-sm font-medium text-destructive">
          Couldn&apos;t load WHT config
        </p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <>
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <div>
            <CardTitle className="font-heading text-base">
              Withholding tax (WHT)
            </CardTitle>
            <CardDescription>
              Changes take effect immediately on interest payouts.
            </CardDescription>
          </div>
          {canEdit ? (
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
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-medium tabular-nums">{wht.whtRatePercent}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={wht.isEnabled ? "default" : "secondary"}>
              {wht.isEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>
      {canEdit ? (
        <EditWhtDialog
          config={wht}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </>
  )
}

export function SavingsRatesSection() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const ratesQuery = useSavingsRates()
  const bandsQuery = useFixedRateBands()

  const isLoading = ratesQuery.isLoading || bandsQuery.isLoading
  const isFetching = ratesQuery.isFetching || bandsQuery.isFetching
  const isError = ratesQuery.isError || bandsQuery.isError
  const error = ratesQuery.error ?? bandsQuery.error

  const refetchAll = () => {
    ratesQuery.refetch()
    bandsQuery.refetch()
  }

  if (isLoading) {
    return <RatesSkeleton />
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
              Couldn&apos;t load savings rates
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={refetchAll}>
          Try again
        </Button>
      </div>
    )
  }

  const rates = ratesQuery.data ?? []
  const tierConfigs = TIER_PRODUCTS.map((product) =>
    rates.find((r) => r.productType === product)
  ).filter((r): r is SavingsRateConfig => r != null)
  const fixedConfig = rates.find((r) => r.productType === "FIXED")
  const bands = bandsQuery.data ?? []

  return (
    <div
      className={cn(
        "flex flex-col gap-6 transition-opacity duration-200",
        isFetching && "opacity-[0.88]"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Rate changes are not retroactive. Displayed percentages come from the
          API; edits are sent in basis points.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={refetchAll}
          disabled={isFetching}
          aria-label="Refresh rates"
        >
          {isFetching ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <RefreshCwIcon className="size-3.5" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tierConfigs.map((config) => (
          <TierRateCard
            key={config.productType}
            config={config}
            canEdit={isSuperAdmin}
          />
        ))}
      </div>

      <FixedAvailabilityCard config={fixedConfig} canEdit={isSuperAdmin} />
      <FixedBandsTable bands={bands} canEdit={isSuperAdmin} />
      <WhtCard canEdit={isSuperAdmin} />
    </div>
  )
}
