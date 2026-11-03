import type { BreadcrumbSegment } from "@gorro/ui/components/site-header"

import { routes } from "@/lib/routes"

export function getMarketingBreadcrumbSegments(
  pathname: string
): BreadcrumbSegment[] {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname

  if (normalized === routes.home) {
    return [{ label: "Overview" }]
  }

  if (normalized === routes.cgas.list) {
    return [
      { label: "Overview", href: routes.home },
      { label: "CGAs" },
    ]
  }

  if (normalized.startsWith(`${routes.cgas.list}/`)) {
    return [
      { label: "Overview", href: routes.home },
      { label: "CGAs", href: routes.cgas.list },
      { label: "Customers" },
    ]
  }

  if (normalized === routes.org.territories) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Territories" },
    ]
  }

  if (normalized === routes.org.teamLeads) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Team leads" },
    ]
  }

  if (normalized === routes.analytics) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Funnel & trends" },
    ]
  }

  if (normalized === routes.targets) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Targets & alerts" },
    ]
  }

  if (normalized === routes.communities.list) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Communities" },
    ]
  }

  if (normalized === routes.campaigns.list) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Campaigns" },
    ]
  }

  if (normalized.startsWith(`${routes.campaigns.list}/`)) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Campaigns", href: routes.campaigns.list },
      { label: "Performance" },
    ]
  }

  if (normalized === routes.segments.list) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Segments" },
    ]
  }

  if (normalized.startsWith(`${routes.segments.list}/`)) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Segments", href: routes.segments.list },
      { label: "Detail" },
    ]
  }

  if (normalized === routes.export) {
    return [
      { label: "Overview", href: routes.home },
      { label: "Exports" },
    ]
  }

  return [{ label: "Overview", href: routes.home }, { label: "Marketing" }]
}
