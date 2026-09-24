"use client"

import { SiteHeader as GorroSiteHeader } from "@gorro/ui/components/site-header"

import { getMarketingBreadcrumbSegments } from "@/lib/breadcrumbs"

export function SiteHeader() {
  return (
    <GorroSiteHeader getBreadcrumbSegments={getMarketingBreadcrumbSegments} />
  )
}
