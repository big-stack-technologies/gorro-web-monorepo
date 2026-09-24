import { z } from "zod"

import type {
  MarketingTeamLead,
  MarketingTerritory,
} from "@/features/cgas/types"

import type { TeamLeadPayload, TerritoryPayload } from "@/features/org/types"
import {
  isValidTerritoryCode,
  normalizeTerritoryCode,
} from "@/features/org/utils/territory-code"

export const territoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().refine(
    (value) => isValidTerritoryCode(normalizeTerritoryCode(value)),
    "Enter a code with letters and digits only"
  ),
})

export type TerritoryFormValues = z.infer<typeof territoryFormSchema>

export function territoryToFormValues(
  territory: MarketingTerritory | null | undefined
): TerritoryFormValues {
  return {
    name: territory?.name ?? "",
    code: territory?.code ?? "",
  }
}

export function territoryFormValuesToPayload(
  values: TerritoryFormValues
): TerritoryPayload {
  return {
    name: values.name.trim(),
    code: normalizeTerritoryCode(values.code),
  }
}

export const TEAM_LEAD_NONE_TERRITORY = "__none__"
export const TEAM_LEAD_NONE_USER = "__none__"

export const teamLeadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string(),
  territoryId: z.string(),
})

export type TeamLeadFormValues = z.infer<typeof teamLeadFormSchema>

export function teamLeadToFormValues(
  teamLead: MarketingTeamLead | null | undefined
): TeamLeadFormValues {
  return {
    name: teamLead?.name ?? "",
    userId: teamLead?.user?.id ?? TEAM_LEAD_NONE_USER,
    territoryId: teamLead?.territory?.id ?? TEAM_LEAD_NONE_TERRITORY,
  }
}

export function teamLeadFormValuesToPayload(
  values: TeamLeadFormValues
): TeamLeadPayload {
  const userId = values.userId.trim()
  return {
    name: values.name.trim(),
    userId:
      values.userId === TEAM_LEAD_NONE_USER || userId.length === 0
        ? null
        : userId,
    territoryId:
      values.territoryId === TEAM_LEAD_NONE_TERRITORY
        ? null
        : values.territoryId,
  }
}
