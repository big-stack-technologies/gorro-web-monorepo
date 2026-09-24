import type {
  AjoFrequency,
  AjoGroupStatus,
  AjoGroupType,
  AjoPenaltyScope,
} from "@/features/ajo/types"

export const AJO_FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY"] as const

export const AJO_PENALTY_SCOPES = ["PUBLIC_ONLY", "ALL"] as const

export const AJO_GROUP_TYPES = ["PUBLIC", "PRIVATE"] as const

export const AJO_GROUP_STATUSES = [
  "FORMING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const

const AJO_FREQUENCY_LABELS: Record<AjoFrequency, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
}

const AJO_PENALTY_SCOPE_LABELS: Record<AjoPenaltyScope, string> = {
  PUBLIC_ONLY: "Public groups only",
  ALL: "All groups",
}

const AJO_GROUP_TYPE_LABELS: Record<AjoGroupType, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
}

const AJO_GROUP_STATUS_LABELS: Record<AjoGroupStatus, string> = {
  FORMING: "Forming",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export function getAjoFrequencyLabel(frequency: AjoFrequency) {
  return AJO_FREQUENCY_LABELS[frequency] ?? frequency
}

export function getAjoPenaltyScopeLabel(scope: AjoPenaltyScope) {
  return AJO_PENALTY_SCOPE_LABELS[scope] ?? scope
}

export function getAjoGroupTypeLabel(type: AjoGroupType) {
  return AJO_GROUP_TYPE_LABELS[type] ?? type
}

export function getAjoGroupStatusLabel(status: AjoGroupStatus) {
  return AJO_GROUP_STATUS_LABELS[status] ?? status
}

export const AJO_FREQUENCY_OPTIONS = AJO_FREQUENCIES.map((value) => ({
  value,
  label: getAjoFrequencyLabel(value),
}))

export const AJO_PENALTY_SCOPE_OPTIONS = AJO_PENALTY_SCOPES.map((value) => ({
  value,
  label: getAjoPenaltyScopeLabel(value),
}))

export const AJO_GROUP_TYPE_FILTER_OPTIONS = AJO_GROUP_TYPES.map((value) => ({
  value,
  label: getAjoGroupTypeLabel(value),
}))

export const AJO_GROUP_STATUS_FILTER_OPTIONS = AJO_GROUP_STATUSES.map(
  (value) => ({
    value,
    label: getAjoGroupStatusLabel(value),
  })
)

export const AJO_CREATED_BY_FILTER_OPTIONS = [
  { value: "true", label: "Admin-created" },
  { value: "false", label: "User-created" },
] as const

/** 1 = Monday … 7 = Sunday */
export const AJO_WEEKDAY_OPTIONS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
] as const

export const AJO_CURRENCY = "NGN"

export function bpsToPercent(bps: number) {
  return bps / 100
}

export function percentToBps(percent: number) {
  return Math.round(percent * 100)
}

export function nairaToMinorUnits(naira: number) {
  return Math.round(naira * 100)
}
