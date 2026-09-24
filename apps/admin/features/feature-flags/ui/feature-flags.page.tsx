"use client"

import {
  AlertCircleIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { FeatureFlagPlatformToggles } from "@/features/feature-flags/ui/feature-flag-platform-toggles"
import { useFeatureFlags } from "@/features/feature-flags/usecases"
import { USER_ROLE } from "@/features/users/constants"
import { cn, formatDateTime, formatSnakeCaseWords } from "@gorro/ui/utils"

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function FeatureFlagsPage() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const { data, isLoading, isFetching, isError, error, refetch } =
    useFeatureFlags()

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Feature flags"
        description="View and manage mobile feature availability per platform."
      />

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          <div className="space-y-1">
            <CardTitle className="font-heading text-base">Flags</CardTitle>
            <CardDescription>
              {isSuperAdmin
                ? "Toggle Android and iOS availability for each feature."
                : "Read-only view. Only super admins can change platform flags."}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh feature flags"
          >
            {isFetching ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
              <RefreshCwIcon className="size-3.5" />
            )}
          </Button>
        </CardHeader>
        <CardContent
          className={cn(
            "transition-opacity duration-200",
            isFetching && !isLoading && "opacity-[0.88]"
          )}
        >
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
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
                    Couldn&apos;t load feature flags
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          ) : !data?.length ? (
            <p className="text-sm text-muted-foreground">No feature flags found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead className="text-right">Last updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell className="min-w-[220px]">
                        <div className="space-y-0.5">
                          <p className="font-medium">
                            {formatSnakeCaseWords(flag.key)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {flag.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <FeatureFlagPlatformToggles
                          flag={flag}
                          canEdit={isSuperAdmin}
                        />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs whitespace-nowrap">
                        {formatDateTime(flag.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
