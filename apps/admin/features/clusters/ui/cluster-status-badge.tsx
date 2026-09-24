import { Badge } from "@gorro/ui/components/ui/badge"
import type {
  ClusterMemberStatus,
  ClusterStatus,
  ClusterWithdrawalStatus,
} from "@/features/clusters/types"

type Status = ClusterStatus | ClusterMemberStatus | ClusterWithdrawalStatus

const LABELS: Record<Status, string> = {
  ACTIVE: "Active",
  CLOSING: "Closing",
  CLOSED: "Closed",
  PENDING_REMOVAL: "Pending removal",
  PENDING_JOIN: "Pending join",
  REMOVED: "Removed",
  PENDING: "Pending",
  APPROVED: "Approved",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  FAILED: "Failed",
}

export function ClusterStatusBadge({ status }: { status: Status }) {
  const variant =
    status === "ACTIVE" || status === "APPROVED" || status === "COMPLETED"
      ? "success"
      : status === "REJECTED" || status === "FAILED" || status === "REMOVED"
        ? "destructive"
        : status === "CLOSED"
          ? "secondary"
          : "outline"

  return <Badge variant={variant}>{LABELS[status]}</Badge>
}
