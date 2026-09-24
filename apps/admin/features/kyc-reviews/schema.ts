import { z } from "zod"

import { ADDRESS_REVIEW_REASON_MAX_LENGTH } from "@/features/kyc-reviews/constants"

export const rejectNinReviewFormSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
})

export type RejectNinReviewFormValues = z.infer<
  typeof rejectNinReviewFormSchema
>

export const rejectAddressReviewFormSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(
      ADDRESS_REVIEW_REASON_MAX_LENGTH,
      `Keep the reason under ${ADDRESS_REVIEW_REASON_MAX_LENGTH} characters. The customer sees this text.`
    ),
})

export type RejectAddressReviewFormValues = z.infer<
  typeof rejectAddressReviewFormSchema
>
