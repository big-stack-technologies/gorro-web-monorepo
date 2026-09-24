export type ReengagementCampaign =
  | "COMPLETE_KYC"
  | "START_SAVING"
  | "REFER_EARN"

export type ReengagementChannel = "PUSH" | "EMAIL"

export type ReengagementConfig = {
  id: string
  masterEnabled: boolean
  kycReminderEnabled: boolean
  firstSaveReminderEnabled: boolean
  referEarnReminderEnabled: boolean
  pushEnabled: boolean
  emailEnabled: boolean
  sendHour: number
  createdAt: string
  updatedAt: string
}

export type UpdateReengagementConfigPayload = Partial<{
  masterEnabled: boolean
  kycReminderEnabled: boolean
  firstSaveReminderEnabled: boolean
  referEarnReminderEnabled: boolean
  pushEnabled: boolean
  emailEnabled: boolean
  sendHour: number
}>

export type ReengagementNudge = {
  id: string
  campaign: ReengagementCampaign
  channel: ReengagementChannel
  sentAt: string
  userId: string
  name: string
  email: string
  phone: string
  kycTier: number
}

export type ReengagementSegment = {
  campaign: ReengagementCampaign
  enabled: boolean
  usersInSegment: number
  dueNow: number
  schedule: string
  lifetimeCap: number
}

export type ReengagementSegmentsResponse = {
  generatedAt: string
  masterEnabled: boolean
  segments: ReengagementSegment[]
}

export type SegmentUser = {
  userId: string
  name: string
  email: string
  phone: string
  signedUpAt: string
  nudgesSent: number
  lastNudgeAt: string | null
  dueNow: boolean
}

export type RunReengagementResponse = {
  success: boolean
  results: Partial<Record<ReengagementCampaign, number>>
  message: string
}

export type ReengagementApiPaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore?: boolean
}

export type ReengagementAudience = string

export type ReengagementAudienceParam = {
  name: string
  type: string
  unit?: string
  default?: number
  value?: number
  description?: string
}

export type ReengagementAudienceOption = {
  value: string
  label: string
  description: string
  matching: number
  withPushToken: number
  withEmail: number
  percentOfAllUsers: number
  params?: ReengagementAudienceParam[]
}

export type ReengagementAudiencesResponse = {
  generatedAt: string
  totalActiveUsers: number
  audiences: ReengagementAudienceOption[]
}

export type ReengagementAudiencesQuery = {
  balanceBelow?: number
}

export type BroadcastReengagementPayload = {
  title: string
  body: string
  audience?: ReengagementAudience
  email?: string
  balanceBelow?: number
}

export type BroadcastReengagementResponse = {
  audience: string
  recipients: number
  title: string
  body: string
}

export type SendReengagementEmailPayload = {
  subject: string
  body: string
  emails?: string[]
  audience?: ReengagementAudience
  balanceBelow?: number
}

export type SendReengagementEmailResponse = {
  recipients: number
  estimatedSeconds: number
  notFound?: string[]
}
