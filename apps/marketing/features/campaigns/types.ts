import type { MarketingNamedRef, MarketingTerritoryRef } from "@/features/cgas/types"

export type {
  MarketingCommunity,
  MarketingCommunityActivityStatus,
  MarketingCommunityListItem,
} from "@/features/communities/types"

export type MarketingCampaign = {
  id: string
  name: string
  startsOn: string
  endsOn: string
  territory: MarketingTerritoryRef | null
  community: MarketingNamedRef | null
  targetAudience: string | null
  cost: number | null
}

export type MarketingCampaignPayload = {
  name: string
  startsOn: string
  endsOn: string
  territoryId?: string | null
  communityId?: string | null
  targetAudience?: string | null
  cost?: number | null
}

export type CampaignOverlap = {
  id: string
  name: string
  startsOn: string
  endsOn: string
}

export type MarketingCampaignPerformance = MarketingCampaign & {
  attribution: string
  attributionNote: string
  overlapsWith: CampaignOverlap[]
  leadsGenerated: number
  signups: number
  kycCompleted: number
  firstDeposits: number
  productAdoption: number
  clustersCreated: number
  transactions: number
  gtv: number
  signupToDepositPct: number
  costPerSignup: number | null
  costPerFirstDeposit: number | null
}

export type CampaignListFilters = {
  territoryId?: string
}
