import type {
  CircleMemberRole,
  CircleMemberStatus,
  CircleStatus,
  CircleVisibility,
} from "@/features/circles/types"

export const CIRCLE_CURRENCY = "NGN"

export const CIRCLE_STATUS_OPTIONS: readonly {
  value: CircleStatus
  label: string
}[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
]

export const CIRCLE_VISIBILITY_OPTIONS: readonly {
  value: CircleVisibility
  label: string
}[] = [
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
]

export const CIRCLE_STATUS_LABELS: Record<CircleStatus, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export const CIRCLE_VISIBILITY_LABELS: Record<CircleVisibility, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
}

export const CIRCLE_MEMBER_ROLE_LABELS: Record<CircleMemberRole, string> = {
  OWNER: "Owner",
  MEMBER: "Member",
}

export const CIRCLE_MEMBER_STATUS_LABELS: Record<CircleMemberStatus, string> = {
  PENDING_JOIN: "Pending join",
  ACTIVE: "Active",
  DECLINED: "Declined",
  LEFT: "Left",
}
