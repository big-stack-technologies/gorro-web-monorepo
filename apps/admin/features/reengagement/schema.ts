import { z } from "zod"

export const updateReengagementConfigFormSchema = z.object({
  masterEnabled: z.boolean(),
  kycReminderEnabled: z.boolean(),
  firstSaveReminderEnabled: z.boolean(),
  referEarnReminderEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  sendHour: z
    .number()
    .int("Must be a whole hour")
    .min(0, "Hour must be between 0 and 23")
    .max(23, "Hour must be between 0 and 23"),
})

export type UpdateReengagementConfigFormValues = z.infer<
  typeof updateReengagementConfigFormSchema
>

export const broadcastReengagementFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    recipientMode: z.enum(["preview", "audience"]),
    previewEmail: z.string().optional(),
    audience: z.string().optional(),
    balanceBelow: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recipientMode === "preview") {
      const result = z.string().email().safeParse(data.previewEmail?.trim())
      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          message: "A valid preview email is required",
          path: ["previewEmail"],
        })
      }
      return
    }

    if (!data.audience) {
      ctx.addIssue({
        code: "custom",
        message: "Audience is required",
        path: ["audience"],
      })
    }
  })

export type BroadcastReengagementFormValues = z.infer<
  typeof broadcastReengagementFormSchema
>

export function parseEmailList(raw: string): string[] {
  const emails = raw
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter(Boolean)

  return [...new Set(emails)]
}

export const sendReengagementEmailFormSchema = z
  .object({
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
    recipientMode: z.enum(["emails", "audience"]),
    emails: z.string().optional(),
    audience: z.string().optional(),
    balanceBelow: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recipientMode === "emails") {
      const parsed = parseEmailList(data.emails ?? "")
      if (parsed.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one email address is required",
          path: ["emails"],
        })
        return
      }

      for (const email of parsed) {
        const result = z.string().email().safeParse(email)
        if (!result.success) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid email: ${email}`,
            path: ["emails"],
          })
          break
        }
      }
      return
    }

    if (!data.audience) {
      ctx.addIssue({
        code: "custom",
        message: "Audience is required",
        path: ["audience"],
      })
    }
  })

export type SendReengagementEmailFormValues = z.infer<
  typeof sendReengagementEmailFormSchema
>
