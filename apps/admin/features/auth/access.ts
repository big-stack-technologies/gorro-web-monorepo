import { USER_ROLE } from "@/features/users/constants"
import { routes } from "@/lib/routes"

const ADMIN_ACCESS_ROLES = [
  USER_ROLE.super_admin,
  USER_ROLE.moderator,
  USER_ROLE.support_agent,
] as const

export function hasAdminAccess(roles?: string[]): boolean {
  if (!roles?.length) return false
  return ADMIN_ACCESS_ROLES.some((role) => roles.includes(role))
}

export function isPartnerOnly(roles?: string[]): boolean {
  if (!roles?.length) return false
  return roles.includes(USER_ROLE.partner) && !hasAdminAccess(roles)
}

export function isSuperAdmin(roles?: string[]): boolean {
  return Boolean(roles?.includes(USER_ROLE.super_admin))
}

export function canManageClusters(roles?: string[]): boolean {
  if (!roles?.length) return false
  return (
    roles.includes(USER_ROLE.super_admin) || roles.includes(USER_ROLE.moderator)
  )
}

/**
 * Circle analytics is read-only. The API also admits `ops_admin`, which this app
 * has no role constant for, so only the roles it knows about are gated here.
 */
export function canViewCircles(roles?: string[]): boolean {
  return canManageClusters(roles)
}

export function canManageReengagement(roles?: string[]): boolean {
  return canManageClusters(roles)
}

export function canVerifyBvn(roles?: string[]): boolean {
  return canManageClusters(roles)
}

export function canCreateVirtualAccount(roles?: string[]): boolean {
  return canManageClusters(roles)
}

/** Decide NIN reviews: super_admin or support_agent. Moderator is view-only. */
export function canDecideNinReview(roles?: string[]): boolean {
  if (!roles?.length) return false
  return (
    roles.includes(USER_ROLE.super_admin) ||
    roles.includes(USER_ROLE.support_agent)
  )
}

/** Decide address reviews: same roles as NIN reviews. */
export function canDecideAddressReview(roles?: string[]): boolean {
  return canDecideNinReview(roles)
}

function isClusterAdminPath(pathname: string): boolean {
  const base = routes.protected.clusters.base
  return pathname === base || pathname.startsWith(`${base}/`)
}

function isCircleAdminPath(pathname: string): boolean {
  const base = routes.protected.circles.base
  return pathname === base || pathname.startsWith(`${base}/`)
}

function isReengagementAdminPath(pathname: string): boolean {
  const base = routes.protected.reengagement.base
  return pathname === base || pathname.startsWith(`${base}/`)
}

function isSavingsAdminPath(pathname: string): boolean {
  const base = routes.protected.savings.base
  return pathname === base || pathname.startsWith(`${base}/`)
}

export function isAdminDashboardPath(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname
  return normalized === routes.protected.admin.base
}

export function canAccessAdminRoute(
  roles: string[] | undefined,
  pathname: string
): boolean {
  if (isPartnerOnly(roles)) {
    return isAdminDashboardPath(pathname) || isSavingsAdminPath(pathname)
  }
  if (isClusterAdminPath(pathname)) return canManageClusters(roles)
  if (isCircleAdminPath(pathname)) return canViewCircles(roles)
  if (isReengagementAdminPath(pathname)) return canManageReengagement(roles)
  return true
}
