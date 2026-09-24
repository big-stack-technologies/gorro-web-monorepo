import { routes } from "@/lib/routes"

export type BreadcrumbSegment = {
  label: string
  /** Omit for the current page segment. */
  href?: string
}

/**
 * Breadcrumb trail for admin shell routes. Extend as you add `/admin/*` pages.
 */
export function getAdminBreadcrumbSegments(pathname: string): BreadcrumbSegment[] {
  const admin = routes.protected.admin.base
  const users = routes.protected.users.base
  const transactions = routes.protected.transactions.base
  const withdrawalRequests = routes.protected.withdrawalRequests.base
  const referrals = routes.protected.referrals.base
  const savings = routes.protected.savings.base
  const featureFlags = routes.protected.featureFlags.base
  const ajo = routes.protected.ajo.base
  const reengagement = routes.protected.reengagement.base
  const kycNinReviews = routes.protected.kycNinReviews.base

  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname

  if (normalized === admin) {
    return [{ label: "Dashboard" }]
  }

  if (normalized === users) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Users" },
    ]
  }

  if (normalized.startsWith(`${users}/`)) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Users", href: users },
      { label: "User details" },
    ]
  }

  if (normalized === transactions) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Transactions" },
    ]
  }

  if (normalized.startsWith(`${transactions}/`)) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Transactions", href: transactions },
      { label: "Transaction details" },
    ]
  }

  if (normalized === withdrawalRequests) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Withdrawal requests" },
    ]
  }

  if (normalized.startsWith(`${withdrawalRequests}/`)) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Withdrawal requests", href: withdrawalRequests },
      { label: "Withdrawal request details" },
    ]
  }

  if (normalized === referrals) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Referrals" },
    ]
  }

  if (normalized.startsWith(`${referrals}/`)) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Referrals", href: referrals },
      { label: "Referral details" },
    ]
  }

  if (normalized === savings) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Savings" },
    ]
  }

  if (normalized === featureFlags) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Feature flags" },
    ]
  }

  if (normalized === ajo) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Ajo" },
    ]
  }

  if (normalized.startsWith(`${ajo}/groups/`)) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Ajo", href: ajo },
      { label: "Group details" },
    ]
  }

  if (normalized === reengagement) {
    return [
      { label: "Dashboard", href: admin },
      { label: "Re-engagement" },
    ]
  }

  if (normalized === kycNinReviews) {
    return [
      { label: "Dashboard", href: admin },
      { label: "NIN reviews" },
    ]
  }

  if (normalized.startsWith(`${kycNinReviews}/`)) {
    return [
      { label: "Dashboard", href: admin },
      { label: "NIN reviews", href: kycNinReviews },
      { label: "Review details" },
    ]
  }

  if (normalized.startsWith(`${admin}/`)) {
    const rest = normalized.slice(admin.length + 1)
    const first = rest.split("/")[0] ?? ""
    const label =
      first.length > 0
        ? first.charAt(0).toUpperCase() +
          first.slice(1).replace(/-/g, " ")
        : "Page"
    return [{ label: "Dashboard", href: admin }, { label }]
  }

  return [{ label: "Admin" }]
}
