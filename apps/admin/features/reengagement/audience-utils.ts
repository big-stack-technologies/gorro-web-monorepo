import type {
  ReengagementAudienceOption,
  ReengagementAudienceParam,
} from "@/features/reengagement/types"

export type ReengagementAudienceChannel = "push" | "email"

export function getAudienceReachCount(
  audience: ReengagementAudienceOption,
  channel: ReengagementAudienceChannel
): number {
  return channel === "push" ? audience.withPushToken : audience.withEmail
}

export function formatAudienceReachCount(count: number): string {
  return count.toLocaleString()
}

export function formatAudienceOptionLabel(
  audience: ReengagementAudienceOption,
  channel: ReengagementAudienceChannel
): string {
  const reach = formatAudienceReachCount(getAudienceReachCount(audience, channel))
  const reachLabel = channel === "push" ? "push" : "email"
  const percent = Number.isInteger(audience.percentOfAllUsers)
    ? String(audience.percentOfAllUsers)
    : audience.percentOfAllUsers.toFixed(1)

  return `${audience.label} · ${reach} ${reachLabel} · ${percent}%`
}

export function findAudienceOption(
  audiences: ReengagementAudienceOption[] | undefined,
  value: string | undefined
): ReengagementAudienceOption | undefined {
  if (!value || !audiences?.length) return undefined
  return audiences.find((audience) => audience.value === value)
}

export function getBalanceBelowParam(
  audience: ReengagementAudienceOption | undefined
): ReengagementAudienceParam | undefined {
  return audience?.params?.find((param) => param.name === "balanceBelow")
}

export function getDefaultBalanceBelow(
  audience: ReengagementAudienceOption | undefined
): number | undefined {
  const param = getBalanceBelowParam(audience)
  if (param?.value != null) return param.value
  if (param?.default != null) return param.default
  return undefined
}
