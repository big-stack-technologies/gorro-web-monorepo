import type { MarketingCommunityType } from "@/features/communities/types"

export const COMMUNITY_TYPES: {
  value: MarketingCommunityType
  label: string
}[] = [
  { value: "MARKET", label: "Market" },
  { value: "CHURCH", label: "Church" },
  { value: "SCHOOL", label: "School" },
  { value: "COOPERATIVE", label: "Cooperative" },
  { value: "ASSOCIATION", label: "Association" },
  { value: "ESTATE", label: "Estate" },
  { value: "WORKPLACE", label: "Workplace" },
  { value: "OTHER", label: "Other" },
]

export const COMMUNITY_TYPE_LABELS = Object.fromEntries(
  COMMUNITY_TYPES.map((item) => [item.value, item.label])
) as Record<MarketingCommunityType, string>
