import { RefreshCwIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"

export function CircleAnalyticsError({
  title,
  error,
  fallback,
  onRetry,
}: {
  title: string
  error: unknown
  fallback: string
  onRetry: () => void
}) {
  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-destructive">
          {error instanceof Error ? error.message : fallback}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}
