import type { User } from "@/features/users/types"

function hasValue(value: string | null | undefined): boolean {
  return Boolean(value?.trim())
}

export function getVirtualAccountEligibility(user: User): {
  eligible: boolean
  missingFields: string[]
} {
  const missingFields: string[] = []

  if (!hasValue(user.firstName)) {
    missingFields.push("first name")
  }
  if (!hasValue(user.lastName)) {
    missingFields.push("last name")
  }
  if (!hasValue(user.bvn)) {
    missingFields.push("BVN")
  }
  if (!hasValue(user.phoneNumber)) {
    missingFields.push("phone number")
  }

  return {
    eligible: missingFields.length === 0,
    missingFields,
  }
}
