import { z } from "zod"

import { COMMUNITY_TYPES } from "@/features/communities/constants"
import type {
  MarketingCommunity,
  MarketingCommunityPayload,
  MarketingCommunityType,
  MarketingCommunityUpdatePayload,
} from "@/features/communities/types"

const communityTypeValues = COMMUNITY_TYPES.map((item) => item.value) as [
  string,
  ...string[],
]

export const communityFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(communityTypeValues, { message: "Type is required" }),
    location: z.string().min(1, "Location is required"),
    estimatedSize: z.string(),
    cgaUserId: z.string().min(1, "CGA is required"),
    acquiredOn: z.string().min(1, "Acquired date is required"),
  })
  .superRefine((data, ctx) => {
    if (data.estimatedSize.trim()) {
      const size = Number(data.estimatedSize)
      if (!Number.isFinite(size) || !Number.isInteger(size) || size < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid whole number",
          path: ["estimatedSize"],
        })
      }
    }
  })

export type CommunityFormValues = z.infer<typeof communityFormSchema>

export function communityToFormValues(
  community: MarketingCommunity | null | undefined
): CommunityFormValues {
  return {
    name: community?.name ?? "",
    type:
      (community?.type as CommunityFormValues["type"]) ??
      communityTypeValues[0],
    location: community?.location ?? "",
    estimatedSize:
      community?.estimatedSize != null ? String(community.estimatedSize) : "",
    cgaUserId: community?.cga?.userId ?? "",
    acquiredOn: community?.acquiredOn?.slice(0, 10) ?? "",
  }
}

export function communityFormValuesToPayload(
  values: CommunityFormValues
): MarketingCommunityPayload {
  const estimatedSize = values.estimatedSize.trim()
    ? Number(values.estimatedSize)
    : null

  return {
    name: values.name.trim(),
    type: values.type as MarketingCommunityType,
    location: values.location.trim(),
    estimatedSize,
    cgaUserId: values.cgaUserId,
    acquiredOn: values.acquiredOn,
  }
}

export function communityFormValuesToUpdatePayload(
  values: CommunityFormValues
): MarketingCommunityUpdatePayload {
  return communityFormValuesToPayload(values)
}
