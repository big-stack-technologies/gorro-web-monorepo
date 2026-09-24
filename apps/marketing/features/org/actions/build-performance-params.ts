import { buildPeriodParams } from "@/features/analytics/actions/build-params"
import type { OrgPerformanceFilters } from "@/features/org/types"

export function buildOrgPerformanceParams(filters: OrgPerformanceFilters) {
  return buildPeriodParams(filters)
}
