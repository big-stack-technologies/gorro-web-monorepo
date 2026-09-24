/** URL / API query keys for listing users (with page & limit). */
export const USER_LIST_FILTER_KEYS = [
  "email",
  "phoneNumber",
  "role",
  "firstName",
  "lastName",
] as const

export type UserListFilterKey = (typeof USER_LIST_FILTER_KEYS)[number]

/**
 * Single source of truth for user role string values (API + admin UI).
 * Add or reorder roles here only.
 */
export const USER_ROLES = [
  "user",
  "super_admin",
  "moderator",
  "support_agent",
  "partner",
] as const

export type UserRole = (typeof USER_ROLES)[number]

/**
 * Named access to role string literals (e.g. `USER_ROLE.moderator`, `USER_ROLE.super_admin`).
 * Prefer this over raw strings when checking or comparing roles in code.
 */
export const USER_ROLE = {
  user: "user",
  super_admin: "super_admin",
  moderator: "moderator",
  support_agent: "support_agent",
  partner: "partner",
} as const satisfies Record<UserRole, UserRole>

const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  super_admin: "Super admin",
  moderator: "Moderator",
  support_agent: "Support agent",
  partner: "Partner",
}

/** Select / filter options: same values as {@link USER_ROLES}, with labels. */
export const USER_ROLE_FILTER_OPTIONS = USER_ROLES.map((value) => ({
  value,
  label: USER_ROLE_LABELS[value],
}))

export const VIRTUAL_ACCOUNT_PROVIDERS = [
  "fincra",
  "flutterwave",
  "paystack",
  "monnify",
] as const

export type VirtualAccountProviderValue =
  (typeof VIRTUAL_ACCOUNT_PROVIDERS)[number]

export const DEFAULT_VIRTUAL_ACCOUNT_PROVIDER: VirtualAccountProviderValue =
  "fincra"

const VIRTUAL_ACCOUNT_PROVIDER_LABELS: Record<
  VirtualAccountProviderValue,
  string
> = {
  fincra: "Fincra",
  flutterwave: "Flutterwave",
  paystack: "Paystack",
  monnify: "Monnify",
}

export const VIRTUAL_ACCOUNT_PROVIDER_OPTIONS =
  VIRTUAL_ACCOUNT_PROVIDERS.map((value) => ({
    value,
    label: VIRTUAL_ACCOUNT_PROVIDER_LABELS[value],
  }))

/** Moderator or super_admin — required for withdrawal request approve/reject. */
export function isModeratorOrAbove(roles?: string[]): boolean {
  if (!roles?.length) return false
  return (
    roles.includes(USER_ROLE.moderator) ||
    roles.includes(USER_ROLE.super_admin)
  )
}
