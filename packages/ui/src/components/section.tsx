"use client"

import { getApiErrorMessage } from "@gorro/api/api-error"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

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
        <p className="text-muted-foreground text-sm">{description}</p>
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
    <div className="bg-destructive/5 ring-destructive/30 flex flex-col gap-3 rounded-xl px-4 py-4 ring-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-destructive text-sm">{getApiErrorMessage(error)}</p>
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
          className="bg-card ring-foreground/10 rounded-xl px-4 py-4 ring-1"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-20" />
          <Skeleton className="mt-3 h-3 w-full" />
        </div>
      ))}
    </div>
  )
}
