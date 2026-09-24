import { z } from "zod"

export const updateTierRateFormSchema = z.object({
  tier1RatePercent: z
    .number()
    .min(0.01, "Tier 1 rate is required")
    .max(100, "Rate cannot exceed 100%"),
  tier2RatePercent: z
    .number()
    .min(0, "Tier 2 rate cannot be negative")
    .max(100, "Rate cannot exceed 100%"),
  tierThresholdNaira: z
    .number()
    .int("Threshold must be a whole naira amount")
    .min(0, "Threshold cannot be negative"),
})

export type UpdateTierRateFormValues = z.infer<typeof updateTierRateFormSchema>

export const updateFixedBandFormSchema = z
  .object({
    ratePercent: z
      .number()
      .min(0.01, "Rate is required")
      .max(100, "Rate cannot exceed 100%"),
    minDays: z
      .number()
      .int("Min days must be a whole number")
      .min(1, "Min days must be at least 1"),
    maxDays: z
      .number()
      .int("Max days must be a whole number")
      .min(1, "Max days must be at least 1"),
  })
  .refine((data) => data.minDays <= data.maxDays, {
    message: "Min days cannot exceed max days",
    path: ["maxDays"],
  })

export type UpdateFixedBandFormValues = z.infer<
  typeof updateFixedBandFormSchema
>

export const updateWhtFormSchema = z.object({
  whtRatePercent: z
    .number()
    .min(0, "WHT rate cannot be negative")
    .max(100, "WHT rate cannot exceed 100%"),
  isEnabled: z.boolean(),
})

export type UpdateWhtFormValues = z.infer<typeof updateWhtFormSchema>
