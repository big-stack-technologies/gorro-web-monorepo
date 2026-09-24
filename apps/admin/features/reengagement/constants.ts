import type {
  ReengagementCampaign,
  ReengagementChannel,
} from "@/features/reengagement/types"

export const REENGAGEMENT_CAMPAIGNS = [
  "COMPLETE_KYC",
  "START_SAVING",
  "REFER_EARN",
] as const satisfies readonly ReengagementCampaign[]

export const REENGAGEMENT_CHANNELS = [
  "PUSH",
  "EMAIL",
] as const satisfies readonly ReengagementChannel[]

export const REENGAGEMENT_CAMPAIGN_LABELS: Record<ReengagementCampaign, string> =
  {
    COMPLETE_KYC: "Complete KYC",
    START_SAVING: "Start saving",
    REFER_EARN: "Refer & earn",
  }

export const REENGAGEMENT_CHANNEL_LABELS: Record<ReengagementChannel, string> =
  {
    PUSH: "Push",
    EMAIL: "Email",
  }

export function getReengagementCampaignLabel(campaign: ReengagementCampaign) {
  return REENGAGEMENT_CAMPAIGN_LABELS[campaign]
}

export function isReengagementCampaign(
  value: string
): value is ReengagementCampaign {
  return REENGAGEMENT_CAMPAIGNS.includes(value as ReengagementCampaign)
}

export const REENGAGEMENT_CAMPAIGN_OPTIONS = REENGAGEMENT_CAMPAIGNS.map(
  (value) => ({
    value,
    label: REENGAGEMENT_CAMPAIGN_LABELS[value],
  })
)

export const REENGAGEMENT_CHANNEL_OPTIONS = REENGAGEMENT_CHANNELS.map(
  (value) => ({
    value,
    label: REENGAGEMENT_CHANNEL_LABELS[value],
  })
)
