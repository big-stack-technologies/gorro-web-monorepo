import type { NinReviewAutoMatch } from "@/features/kyc-reviews/types"

export type AutoMatchCheckResult = "match" | "mismatch" | "not-compared"

export type AutoMatchCheck = {
  label: string
  result: AutoMatchCheckResult
}

export type AutoMatchSummary = {
  checks: AutoMatchCheck[]
  matchCount: number
  comparedCount: number
}

function mapTriState(value: boolean | null): AutoMatchCheckResult {
  if (value === true) return "match"
  if (value === false) return "mismatch"
  return "not-compared"
}

export function getAutoMatchChecks(
  autoMatch: NinReviewAutoMatch | null
): AutoMatchSummary | null {
  if (!autoMatch) return null

  const checks: AutoMatchCheck[] = [
    { label: "Full name", result: autoMatch.nameMatch ? "match" : "mismatch" },
    {
      label: "Surname",
      result: autoMatch.surnameMatched ? "match" : "mismatch",
    },
    { label: "Date of birth", result: mapTriState(autoMatch.dobMatch) },
    { label: "Gender", result: mapTriState(autoMatch.genderMatch) },
  ]

  const compared = checks.filter((c) => c.result !== "not-compared")
  const matchCount = compared.filter((c) => c.result === "match").length

  return {
    checks,
    matchCount,
    comparedCount: compared.length,
  }
}
