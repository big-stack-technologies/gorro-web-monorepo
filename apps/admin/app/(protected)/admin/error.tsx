"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { useEffect } from "react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDev = process.env.NODE_ENV === "development"
  useEffect(() => {
    // Log error to error reporting service
    console.error("Dashboard error:", error);
  }, [error]);


  return (
    <div className="flex min-h-[min(60vh,32rem)] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-lg border-destructive/20 shadow-lg ring-destructive/10">
        <CardHeader className="border-b border-destructive/10 bg-destructive/5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
              <AlertTriangle className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-destructive">This page failed to load</CardTitle>
              <CardDescription>
                Something went wrong while rendering the dashboard. You can try again, or
                return later if the problem persists.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Error
            </p>
            <pre className="max-h-40 overflow-auto rounded-lg border border-border bg-muted/50 px-3 py-2.5 font-mono text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-foreground">
              {error.message || "Unknown error"}
            </pre>
          </div>
          {error.digest ? (
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Digest
              </p>
              <code className="block rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
                {error.digest}
              </code>
            </div>
          ) : null}
          {isDev && error.stack ? (
            <details className="group rounded-lg border border-dashed border-border bg-muted/20">
              <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Stack trace (development only)
              </summary>
              <pre className="max-h-48 overflow-auto border-t border-border px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {error.stack}
              </pre>
            </details>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t border-border/80">
          <Button type="button" onClick={() => reset()} className="gap-1.5">
            <RefreshCw className="size-3.5" aria-hidden />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
