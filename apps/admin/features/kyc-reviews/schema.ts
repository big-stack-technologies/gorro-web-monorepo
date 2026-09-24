import { z } from "zod"

export const rejectNinReviewFormSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
})

export type RejectNinReviewFormValues = z.infer<
  typeof rejectNinReviewFormSchema
>
