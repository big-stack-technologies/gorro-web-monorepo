import type { AnalyticsPeriodFilters } from "@/features/analytics/types"
import type {
  MarketingTerritory,
  MarketingTerritoryRef,
} from "@/features/cgas/types"

export type TerritoryPayload = {
  name: string
  code: string
}

export type TerritoryUpdatePayload = {
  name?: string
  code?: string
  isActive?: boolean
}

export type TeamLeadPayload = {
  name: string
  userId?: string | null
  territoryId?: string | null
}

export type TeamLeadUpdatePayload = {
  name?: string
  userId?: string | null
  territoryId?: string | null
  isActive?: boolean
}

export type TerritoryPerformanceRow = {
  territoryId: string | null
  name: string
  code: string | null
  registeredUsers: number
  kycCompleted: number
  firstDeposits: number
  firstDepositRate: number
  signups: number
  activeUsers: number
  dormantUsers: number
  dormancyRate: number
  ajoGroups: number
  clusters: number
  transactions: number
  gtv: number
  cgaCount: number
  teamLeadCount: number
  gtvPerCga: number
  signupsPerCga: number
  fieldActivity: number | null
}

export type TerritoriesPerformanceResponse = {
  period: { from: string; to: string }
  regions: TerritoryPerformanceRow[]
}

export type TeamLeadPerformanceRow = {
  teamLeadId: string | null
  name: string
  territory: MarketingTerritoryRef | null
  cgaCount: number
  cgasWithoutTarget: number
  signups: number
  kycCompleted: number
  firstDeposits: number
  firstDepositRate: number
  productAdoption: number
  clustersCreated: number
  transactions: number
  gtv: number
  activeCustomers: number
  dormantCustomers: number
  dormancyRate: number
  target: number | null
  achievementPct: number | null
  status: string
  avgCgaAchievementPct: number | null
  cgasAtOrAbove80Pct: number | null
  reportingCompliancePct: number | null
}

export type TeamLeadsPerformanceResponse = {
  period: { from: string; to: string }
  pacePct: number
  teams: TeamLeadPerformanceRow[]
}

export type OrgListOptions = {
  includeInactive?: boolean
}

export type OrgPerformanceFilters = AnalyticsPeriodFilters

export type { MarketingTerritory }
