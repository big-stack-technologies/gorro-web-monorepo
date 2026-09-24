import { Badge } from "@gorro/ui/components/ui/badge"
import {
  NIN_REVIEW_SLA_BREACH_HOURS,
  NIN_REVIEW_SLA_WARNING_HOURS,
} from "@/features/kyc-reviews/constants"
import { cn } from "@gorro/ui/utils"

type NinReviewSlaBadgeProps = {
  waitingHours: number
  className?: string
}

export function NinReviewSlaBadge({
  waitingHours,
  className,
}: NinReviewSlaBadgeProps) {
  const breached = waitingHours >= NIN_REVIEW_SLA_BREACH_HOURS
  const atRisk =
    !breached && waitingHours >= NIN_REVIEW_SLA_WARNING_HOURS

  const label = breached
    ? "SLA breached"
    : atRisk
      ? "SLA risk"
      : `${waitingHours}h`

  return (
    <Badge
      variant={breached ? "destructive" : atRisk ? "outline" : "secondary"}
      className={cn(
        atRisk &&
          "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        className
      )}
    >
      {label}
      {(breached || atRisk) && (
        <span className="font-normal text-inherit/80"> · {waitingHours}h</span>
      )}
    </Badge>
  )
}

export function computeWaitingHours(submittedAt: string): number {
  const submitted = new Date(submittedAt).getTime()
  if (!Number.isFinite(submitted)) return 0
  const diffMs = Date.now() - submitted
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))
}
