import {
  CheckCircle2Icon,
  CircleHelpIcon,
  XCircleIcon,
} from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import {
  getAutoMatchChecks,
  type AutoMatchCheckResult,
} from "@/features/kyc-reviews/auto-match"
import type { NinReviewAutoMatch } from "@/features/kyc-reviews/types"
import { cn } from "@gorro/ui/utils"

type NinReviewAutoMatchPanelProps = {
  autoMatch: NinReviewAutoMatch | null
  vendorError: string | null
}

function AutoMatchResultIcon({ result }: { result: AutoMatchCheckResult }) {
  if (result === "match") {
    return <CheckCircle2Icon className="size-4 text-success" />
  }
  if (result === "mismatch") {
    return <XCircleIcon className="size-4 text-destructive" />
  }
  return <CircleHelpIcon className="size-4 text-muted-foreground" />
}

function autoMatchResultLabel(result: AutoMatchCheckResult) {
  if (result === "match") return "Matched"
  if (result === "mismatch") return "Mismatch"
  return "No data"
}

function TokenRow({
  label,
  tokens,
  matchedTokens,
}: {
  label: string
  tokens: string[]
  matchedTokens: Set<string>
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[minmax(0,8rem)_1fr] sm:items-baseline sm:gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {tokens.length === 0 ? (
          <span className="text-sm text-muted-foreground">—</span>
        ) : (
          tokens.map((token) => (
            <Badge
              key={token}
              variant={matchedTokens.has(token.toLowerCase()) ? "success" : "outline"}
            >
              {token}
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}

export function NinReviewAutoMatchPanel({
  autoMatch,
  vendorError,
}: NinReviewAutoMatchPanelProps) {
  const summary = getAutoMatchChecks(autoMatch)

  if (!autoMatch || !summary) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="text-sm font-semibold">Automatic comparison</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The registry returned no data, so nothing could be cross-checked
          against the Tier-1 BVN record. This decision rests on human judgment.
        </p>
        {vendorError ? (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
            Vendor error: {vendorError}
          </p>
        ) : null}
      </div>
    )
  }

  const matchedTokens = new Set(
    autoMatch.matchedTokens.map((token) => token.toLowerCase())
  )
  const hasTokenSets =
    (autoMatch.ninTokens?.length ?? 0) > 0 ||
    (autoMatch.bvnTokens?.length ?? 0) > 0

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold">Automatic comparison</h3>
        <Badge variant={autoMatch.strong ? "success" : "outline"}>
          {autoMatch.strong ? "Strong match" : "Weak match"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {summary.matchCount}/{summary.comparedCount} checks matched
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        NIN registry data cross-checked against the Tier-1 BVN record. Names are
        compared as token sets, so ordering does not matter.
      </p>

      <ul className="mt-4 space-y-2">
        {summary.checks.map((check) => (
          <li
            key={check.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-muted-foreground">{check.label}</span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-medium",
                check.result === "match" && "text-success",
                check.result === "mismatch" && "text-destructive",
                check.result === "not-compared" && "text-muted-foreground"
              )}
            >
              <AutoMatchResultIcon result={check.result} />
              {autoMatchResultLabel(check.result)}
            </span>
          </li>
        ))}
      </ul>

      {hasTokenSets ? (
        <div className="mt-4 space-y-2 border-t pt-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Name tokens
          </p>
          <TokenRow
            label="NIN registry"
            tokens={autoMatch.ninTokens ?? []}
            matchedTokens={matchedTokens}
          />
          <TokenRow
            label="BVN record"
            tokens={autoMatch.bvnTokens ?? []}
            matchedTokens={matchedTokens}
          />
        </div>
      ) : autoMatch.matchedTokens.length > 0 ? (
        <div className="mt-4 border-t pt-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Matched name tokens
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {autoMatch.matchedTokens.map((token) => (
              <Badge key={token} variant="success">
                {token}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function NinReviewAutoMatchSummary({
  autoMatch,
}: {
  autoMatch: NinReviewAutoMatch | null
}) {
  const summary = getAutoMatchChecks(autoMatch)
  if (!autoMatch || !summary) {
    return <span className="text-sm text-muted-foreground">Not available</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant={autoMatch.strong ? "success" : "outline"}>
        {autoMatch.strong ? "Strong" : "Weak"}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {summary.matchCount}/{summary.comparedCount} matched
      </span>
    </div>
  )
}
