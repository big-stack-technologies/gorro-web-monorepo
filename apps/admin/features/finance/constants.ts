/** Roles the finance API accepts; anyone else gets 403. */
export const FINANCE_ROLES = ["super_admin", "moderator", "ops_admin"] as const

export function canViewFinance(roles: string[] | null | undefined) {
  return (
    roles?.some((role) =>
      (FINANCE_ROLES as readonly string[]).includes(role)
    ) === true
  )
}

/** Matches the API default range: `to` = today, `from` = 30 days before. */
export const DEFAULT_FINANCE_RANGE_DAYS = 30

export const FINANCE_ROLE_RELOGIN_HINT =
  "Finance needs the super_admin, moderator or ops_admin role. Roles are fixed at login, so if one was just granted, log out and back in."

export const PARTIAL_FALLBACK_REASON =
  "This position is partial. Do not read net as a profit or loss figure."

export const PENDING_FALLBACK_NOTE =
  "Charged but not posted. Pipeline only — never counted as revenue."

export const FLOAT_SPREAD_FALLBACK_NOTE = "Not instrumented yet."

export const FUNDS_IN_TRANSIT_FALLBACK_NOTE =
  "Collected by the processors but not yet swept. Not tracked."

export const RECONCILIATION_FALLBACK_NOTE =
  "No reconciliation source exists yet."
