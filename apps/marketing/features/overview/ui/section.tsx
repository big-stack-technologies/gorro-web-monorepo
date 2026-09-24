"use client"

import { getApiErrorMessage } from "@gorro/api/api-error"
import { Button } from "@gorro/ui/components/ui/button"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"

export function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-1">
      <h2 className="font-heading text-base font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export function SectionError({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-destructive/5 px-4 py-4 ring-1 ring-destructive/30 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

export function CardGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl bg-card px-4 py-4 ring-1 ring-foreground/10"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-20" />
          <Skeleton className="mt-3 h-3 w-full" />
        </div>
      ))}
    </div>
  )
}
