import { Badge } from "@gorro/ui/components/ui/badge"
import {
  CIRCLE_MEMBER_STATUS_LABELS,
  CIRCLE_STATUS_LABELS,
} from "@/features/circles/constants"
import type { CircleMemberStatus, CircleStatus } from "@/features/circles/types"

export function CircleStatusBadge({ status }: { status: CircleStatus }) {
  const variant =
    status === "ACTIVE"
      ? "success"
      : status === "CANCELLED"
        ? "destructive"
        : "secondary"

  return <Badge variant={variant}>{CIRCLE_STATUS_LABELS[status]}</Badge>
}

export function CircleMemberStatusBadge({
  status,
}: {
  status: CircleMemberStatus
}) {
  const variant =
    status === "ACTIVE"
      ? "success"
      : status === "DECLINED"
        ? "destructive"
        : status === "LEFT"
          ? "secondary"
          : "outline"

  return <Badge variant={variant}>{CIRCLE_MEMBER_STATUS_LABELS[status]}</Badge>
}
