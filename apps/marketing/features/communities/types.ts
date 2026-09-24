import type { MarketingNamedRef, MarketingTerritoryRef } from "@/features/cgas/types"

export type MarketingCommunityType =
  | "MARKET"
  | "CHURCH"
  | "SCHOOL"
  | "COOPERATIVE"
  | "ASSOCIATION"
  | "ESTATE"
  | "WORKPLACE"
  | "OTHER"

export type MarketingCommunityActivityStatus =
  | "ACTIVE"
  | "DORMANT"
  | "EMPTY"
  | string

export type MarketingCommunityCgaRef = {
  userId: string
  name: string
}

export type MarketingCommunity = {
  id: string
  name: string
  type: MarketingCommunityType | string | null
  location: string | null
  estimatedSize: number | null
  acquiredOn: string | null
  cga: MarketingCommunityCgaRef | null
  teamLead: MarketingNamedRef | null
  territory: MarketingTerritoryRef | null
  registeredMembers: number
  penetrationPct: number | null
  kycCompleted: number
  firstDeposits: number
  ajoParticipants: number
  clusterMembers: number
  activeMembers: number
  dormantMembers: number
  transactions: number
  transactionValue: number
  activityStatus: MarketingCommunityActivityStatus
}

/** Same row shape as list GET; used by campaigns community select. */
export type MarketingCommunityListItem = MarketingCommunity

export type CommunityListFilters = {
  type?: string
  territoryId?: string
  cgaUserId?: string
}

export type MarketingCommunityPayload = {
  name: string
  type: MarketingCommunityType
  location: string
  estimatedSize?: number | null
  cgaUserId: string
  acquiredOn: string
}

export type MarketingCommunityUpdatePayload = Partial<MarketingCommunityPayload>

export type CommunityMemberSkipped = {
  userId: string
  name?: string | null
  reason?: string | null
}

export type LinkCommunityMembersPayload = {
  userIds: string[]
}

/** Skipped entry from link-members API — object with details or a user id string. */
export type CommunityMemberSkippedItem =
  | CommunityMemberSkipped
  | string

export type LinkCommunityMembersResponse = {
  added: number
  message: string
  skipped: CommunityMemberSkippedItem[]
}
