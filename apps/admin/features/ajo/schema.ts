import { z } from "zod"

import { AJO_FREQUENCIES, AJO_PENALTY_SCOPES } from "@/features/ajo/constants"

export const updateAjoConfigFormSchema = z.object({
  minContributionNaira: z
    .number()
    .min(1, "Minimum contribution is required")
    .int("Must be a whole naira amount"),
  maxSlotsPerGroup: z
    .number()
    .int("Must be a whole number")
    .min(2, "Must allow at least 2 slots"),
  maxSlotsPerMember: z
    .number()
    .int("Must be a whole number")
    .min(1, "Must allow at least 1 slot per member"),
  penaltyPercent: z
    .number()
    .min(0, "Penalty cannot be negative")
    .max(100, "Penalty cannot exceed 100%"),
  penaltyMinNaira: z
    .number()
    .min(0, "Minimum penalty cannot be negative")
    .int("Must be a whole naira amount"),
  penaltyMaxNaira: z
    .number()
    .min(0, "Maximum penalty cannot be negative")
    .int("Must be a whole naira amount"),
  graceWindowHours: z
    .number()
    .int("Must be a whole number of hours")
    .min(1, "Grace window must be at least 1 hour"),
  penaltyScope: z.enum(AJO_PENALTY_SCOPES),
})

export type UpdateAjoConfigFormValues = z.infer<typeof updateAjoConfigFormSchema>

export const createAjoGroupFormSchema = z
  .object({
    name: z.string().min(1, "Group name is required"),
    contributionAmount: z
      .number()
      .min(1, "Contribution amount is required")
      .int("Must be a whole naira amount"),
    frequency: z.enum(AJO_FREQUENCIES),
    contributionDayOfWeek: z.number().int().min(1).max(7).optional(),
    payoutDayOfWeek: z.number().int().min(1).max(7).optional(),
    startDate: z.string().min(1, "Start date is required"),
    slotCount: z
      .number()
      .int("Must be a whole number")
      .min(2, "Must have at least 2 slots"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.frequency !== "WEEKLY") return

    if (
      data.contributionDayOfWeek == null ||
      Number.isNaN(data.contributionDayOfWeek)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Contribution day is required for weekly groups",
        path: ["contributionDayOfWeek"],
      })
    }

    if (data.payoutDayOfWeek == null || Number.isNaN(data.payoutDayOfWeek)) {
      ctx.addIssue({
        code: "custom",
        message: "Payout day is required for weekly groups",
        path: ["payoutDayOfWeek"],
      })
    }
  })

export type CreateAjoGroupFormValues = z.infer<typeof createAjoGroupFormSchema>
