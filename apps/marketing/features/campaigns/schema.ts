import { z } from "zod"

import type { MarketingCampaign, MarketingCampaignPayload } from "@/features/campaigns/types"

export const NONE_TERRITORY = "__none__"
export const NONE_COMMUNITY = "__none__"

export const campaignFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startsOn: z.string().min(1, "Start date is required"),
    endsOn: z.string().min(1, "End date is required"),
    territoryId: z.string(),
    communityId: z.string(),
    targetAudience: z.string(),
    cost: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.cost.trim()) {
      const costNum = Number(data.cost)
      if (!Number.isFinite(costNum)) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid cost amount",
          path: ["cost"],
        })
      } else if (costNum < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Cost cannot be negative",
          path: ["cost"],
        })
      }
    }

    if (
      data.startsOn &&
      data.endsOn &&
      data.endsOn < data.startsOn
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be on or after start date",
        path: ["endsOn"],
      })
    }
  })

export type CampaignFormValues = z.infer<typeof campaignFormSchema>

export function campaignToFormValues(
  campaign: MarketingCampaign | null | undefined
): CampaignFormValues {
  return {
    name: campaign?.name ?? "",
    startsOn: campaign?.startsOn?.slice(0, 10) ?? "",
    endsOn: campaign?.endsOn?.slice(0, 10) ?? "",
    territoryId: campaign?.territory?.id ?? NONE_TERRITORY,
    communityId: campaign?.community?.id ?? NONE_COMMUNITY,
    targetAudience: campaign?.targetAudience ?? "",
    cost: campaign?.cost != null ? String(campaign.cost) : "",
  }
}

export function campaignFormValuesToPayload(
  values: CampaignFormValues
): MarketingCampaignPayload {
  const costNum = values.cost.trim() ? Number(values.cost) : null

  return {
    name: values.name.trim(),
    startsOn: values.startsOn,
    endsOn: values.endsOn,
    territoryId:
      values.territoryId === NONE_TERRITORY ? null : values.territoryId,
    communityId:
      values.communityId === NONE_COMMUNITY ? null : values.communityId,
    targetAudience: values.targetAudience.trim() || null,
    cost: costNum,
  }
}
