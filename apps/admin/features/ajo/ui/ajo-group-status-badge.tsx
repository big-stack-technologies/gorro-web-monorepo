import { Badge } from "@gorro/ui/components/ui/badge"
import type { AjoGroupStatus } from "@/features/ajo/types"
import { getAjoGroupStatusLabel } from "@/features/ajo/constants"

export function AjoGroupStatusBadge({ status }: { status: AjoGroupStatus }) {
  const variant =
    status === "ACTIVE"
      ? "success"
      : status === "COMPLETED"
        ? "secondary"
        : status === "CANCELLED"
          ? "destructive"
          : "outline"

  return <Badge variant={variant}>{getAjoGroupStatusLabel(status)}</Badge>
}
