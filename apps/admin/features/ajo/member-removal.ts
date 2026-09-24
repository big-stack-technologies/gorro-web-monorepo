import { AJO_CURRENCY } from "@/features/ajo/constants"
import type {
  AjoGroupMember,
  AjoGroupStatus,
} from "@/features/ajo/types"
import { formatCurrencyAmount } from "@gorro/ui/utils"

export function canRemoveAjoMember(
  member: AjoGroupMember,
  groupStatus: AjoGroupStatus
): boolean {
  if (groupStatus === "COMPLETED" || groupStatus === "CANCELLED") return false
  if (member.role === "ORGANISER") return false
  return true
}

export function getAjoMemberRemovalBlockReason(
  member: AjoGroupMember,
  groupStatus: AjoGroupStatus
): string | null {
  if (groupStatus === "COMPLETED" || groupStatus === "CANCELLED") {
    return "Members cannot be removed from a closed group"
  }
  if (member.role === "ORGANISER") {
    return "The organiser cannot be removed"
  }
  return null
}

export function getAjoMemberRemovalWarnings(member: AjoGroupMember): string[] {
  const warnings: string[] = []

  if (member.isRecipient) {
    warnings.push(
      "This member is the current cycle recipient — rotation order will change."
    )
  }
  if (member.outstandingOwed > 0) {
    warnings.push(
      `Outstanding balance: ${formatCurrencyAmount(member.outstandingOwed, AJO_CURRENCY)}`
    )
  }
  if (member.defaultCount > 0) {
    warnings.push(`Member has ${member.defaultCount} default(s) on record.`)
  }
  if (member.flagged) {
    warnings.push("Member is flagged.")
  }

  return warnings
}
