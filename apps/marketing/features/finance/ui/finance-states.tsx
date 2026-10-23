"use client"

import { InfoIcon, TriangleAlertIcon } from "lucide-react"

import { getApiErrorStatus } from "@gorro/api/api-error"
import { cn } from "@gorro/ui/utils"

import { FINANCE_ROLE_RELOGIN_HINT } from "@/features/finance/constants"
import { SectionError } from "@/features/overview/ui/section"

export function FinanceSectionError({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  return (
    <div className="space-y-2">
      <SectionError error={error} onRetry={onRetry} />
      {getApiErrorStatus(error) === 403 ? (
        <p className="text-sm text-muted-foreground">
          {FINANCE_ROLE_RELOGIN_HINT}
        </p>
      ) : null}
    </div>
  )
}

/** Caveat text from the API. It is written for the reader, so always show it. */
export function FinanceNote({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode
  tone?: "muted" | "warning"
  className?: string
}) {
  if (!children) return null
  const Icon = tone === "warning" ? TriangleAlertIcon : InfoIcon
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-xs leading-relaxed",
        tone === "warning"
          ? "text-amber-700 dark:text-amber-400"
          : "text-muted-foreground",
        className
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

/** A figure we genuinely do not have. Deliberately not ₦0 and not a tick. */
export function FinanceUnknownValue({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-amber-500/50 px-2 py-0.5 text-base font-medium text-amber-700 dark:text-amber-400">
      {label}
    </span>
  )
}

export function FinancePartialBanner({ reason }: { reason: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3"
    >
      <TriangleAlertIcon
        className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden
      />
      <div className="space-y-1 text-sm">
        <p className="font-semibold">
          Partial position — net is not a profit or loss figure
        </p>
        <p className="text-muted-foreground">{reason}</p>
      </div>
    </div>
  )
}
