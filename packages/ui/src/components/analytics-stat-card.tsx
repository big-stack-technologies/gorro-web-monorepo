import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"

type AnalyticsStatCardProps = {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: ReactNode
}

export function AnalyticsStatCard({
  icon: Icon,
  label,
  value,
  hint,
}: AnalyticsStatCardProps) {
  return (
    <Card className="border-border/80 bg-linear-to-br from-primary/[0.07] from-0% to-card to-45% shadow-sm ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0 space-y-1 pr-2">
          <CardDescription className="text-[0.7rem] font-medium tracking-wide uppercase">
            {label}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums tracking-tight text-foreground @container/card:text-3xl">
            {value}
          </CardTitle>
        </div>
        <div className="shrink-0 rounded-xl bg-primary/12 p-2.5 text-primary">
          <Icon className="size-4" aria-hidden />
        </div>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  )
}
