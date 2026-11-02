import { formatPercentSaved } from "@/features/circles/format"
import { cn } from "@gorro/ui/utils"

/**
 * Progress toward the circle goal. The bar is clamped to 100% but the label
 * keeps the real figure: a circle can be saved past its target, which is worth seeing.
 */
export function CircleProgress({
  percentSaved,
  className,
}: {
  percentSaved: number
  className?: string
}) {
  const clamped = Math.min(Math.max(percentSaved, 0), 100)

  return (
    <div className={cn("flex min-w-28 flex-col gap-1", className)}>
      <div
        role="progressbar"
        aria-label="Saved toward goal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-valuetext={`${formatPercentSaved(percentSaved)} of goal saved`}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs text-muted-foreground tabular-nums",
          percentSaved > 100 && "font-medium text-success"
        )}
      >
        {formatPercentSaved(percentSaved)} of goal
      </span>
    </div>
  )
}
