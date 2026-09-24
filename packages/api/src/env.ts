import { z } from "zod"

const clientEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3000"),
})

export const env = clientEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})

export type Env = z.infer<typeof clientEnvSchema>
