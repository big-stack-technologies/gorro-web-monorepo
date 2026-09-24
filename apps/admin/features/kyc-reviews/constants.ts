import type { NinReviewStatus } from "@/features/kyc-reviews/types"
import { formatSnakeCaseWords } from "@gorro/ui/utils"

export const NIN_REVIEW_STATUSES = [
  "PENDING",
  "PENDING_REVIEW",
  "VERIFIED",
  "FAILED",
  "APPROVED_AUTO",
  "APPROVED_MANUAL",
  "REJECTED_MANUAL",
] as const satisfies readonly NinReviewStatus[]

export const NIN_REVIEW_PENDING_STATUS: NinReviewStatus = "PENDING_REVIEW"

export const NIN_REVIEW_STATUS_LABELS: Record<NinReviewStatus, string> = {
  PENDING: "Pending",
  PENDING_REVIEW: "Pending review",
  VERIFIED: "Verified",
  FAILED: "Failed",
  APPROVED_AUTO: "Approved (auto)",
  APPROVED_MANUAL: "Approved (manual)",
  REJECTED_MANUAL: "Rejected (manual)",
}

export const NIN_REVIEW_STATUS_FILTER_OPTIONS = NIN_REVIEW_STATUSES.map(
  (status) => ({
    value: status,
    label: NIN_REVIEW_STATUS_LABELS[status],
  })
)

export const NIN_REVIEW_SLA_WARNING_HOURS = 18
export const NIN_REVIEW_SLA_BREACH_HOURS = 24

export type NinReviewCompareFieldKey =
  | "firstName"
  | "middleName"
  | "lastName"
  | "dob"
  | "gender"
  | "phone"

export const NIN_REVIEW_COMPARE_FIELDS: {
  key: NinReviewCompareFieldKey
  label: string
}[] = [
  { key: "firstName", label: "First name" },
  { key: "middleName", label: "Middle name" },
  { key: "lastName", label: "Last name" },
  { key: "dob", label: "Date of birth" },
  { key: "gender", label: "Gender" },
  { key: "phone", label: "Phone" },
]

export function formatNinReviewStatus(status: string) {
  if (status in NIN_REVIEW_STATUS_LABELS) {
    return NIN_REVIEW_STATUS_LABELS[status as NinReviewStatus]
  }
  return formatSnakeCaseWords(status)
}
