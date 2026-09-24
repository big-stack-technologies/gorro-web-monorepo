export type AjoPenaltyScope = "PUBLIC_ONLY" | "ALL"

export type AjoGroupType = "PUBLIC" | "PRIVATE"

export type AjoFrequency = "DAILY" | "WEEKLY" | "MONTHLY"

export type AjoGroupStatus =
  | "FORMING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"

export type AjoMemberRole = "ORGANISER" | "PARTICIPANT"

export type AjoMemberStatus = "PENDING_JOIN" | "ACTIVE" | "DECLINED" | "REMOVED"

export type AjoSlotOrderMode = "ORGANISER_SET" | "SYSTEM_RANDOMISED"

export type AjoConfig = {
  id: string
  minContributionMinor: number
  minContributionNaira: number
  maxSlotsPerGroup: number
  maxSlotsPerMember: number
  penaltyPercentBps: number
  penaltyMinNaira: number
  penaltyMaxNaira: number
  graceWindowHours: number
  penaltyScope: AjoPenaltyScope
  updatedAt: string
}

export type UpdateAjoConfigPayload = {
  minContributionMinor?: number
  maxSlotsPerGroup?: number
  maxSlotsPerMember?: number
  penaltyPercentBps?: number
  penaltyMinMinor?: number
  penaltyMaxMinor?: number
  graceWindowHours?: number
  penaltyScope?: AjoPenaltyScope
}

export type CreateAjoGroupPayload = {
  name: string
  type: "PUBLIC"
  contributionAmount: number
  frequency: AjoFrequency
  startDate: string
  slotCount: number
  contributionDayOfWeek?: number
  payoutDayOfWeek?: number
  perMemberSlotCap?: number
  imageUrl?: string
  description?: string
  penaltyAmount?: number
}

export type AjoGroup = {
  id: string
  name: string
  code: string
  type: AjoGroupType
  status: AjoGroupStatus
  contributionAmount: number
  frequency: AjoFrequency
  startDate: string
  slotsTotal: number
  slotsFilled: number
  slotsRemaining: number
  imageUrl?: string | null
  description?: string | null
}

export type AjoGroupListItem = {
  id: string
  name: string
  code: string
  type: AjoGroupType
  status: AjoGroupStatus
  createdByAdmin: boolean
  organiserName: string
  organiserEmail: string
  contributionAmount: number
  frequency: AjoFrequency
  slotsTotal: number
  slotsFilled: number
  membersCount: number
  poolBalance: number
  currentCycleNumber: number
  startDate: string
  createdAt: string
  closedAt: string | null
}

export type AjoGroupsApiResponse = {
  page: number
  limit: number
  total: number
  hasMore?: boolean
  data: AjoGroupListItem[]
}

export type AjoGroupMembership = {
  status: AjoMemberStatus
  role: AjoMemberRole
  slotsHeld: number
}

export type AjoGroupCurrentCycle = {
  cycleNumber: number | null
  dueDate: string | null
  cycleStatus: string | null
  recipient: string | null
}

export type AjoGroupMember = {
  memberId: string
  userId: string
  name: string
  role: AjoMemberRole
  slotsHeld: number
  isRecipient: boolean
  isMe: boolean
  totalContributed: number
  defaultCount: number
  flagged: boolean
  outstandingOwed: number
  currentCycle: string | null
}

export type AjoGroupDetail = {
  id: string
  name: string
  code: string
  imageUrl?: string | null
  description?: string | null
  type: AjoGroupType
  status: AjoGroupStatus
  contributionAmount: number
  frequency: AjoFrequency
  startDate: string
  endDate: string | null
  contributionDayOfWeek: number | null
  payoutDayOfWeek: number | null
  contributionDayOfMonth: number | null
  payoutDayOfMonth: number | null
  contributionDayLabel: string | null
  payoutDayLabel: string | null
  slotsTotal: number
  slotsFilled: number
  slotsRemaining: number
  perMemberSlotCap: number
  slotOrderMode: AjoSlotOrderMode
  orderProvenance: string | null
  randomised: boolean
  currentCycleNumber: number
  organiserName: string
  isOrganiser: boolean
  myMembership: AjoGroupMembership | null
  poolBalance: number
  amountContributed: number
  amountExpected: number
  penaltyAmount: number
  closedAt: string | null
  currentCycle: AjoGroupCurrentCycle
  members: AjoGroupMember[]
}
