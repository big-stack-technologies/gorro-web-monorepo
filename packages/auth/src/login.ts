import { redirect, unstable_rethrow } from "next/navigation"

import { isApiError, post } from "@gorro/api/client"
import { setAuthTokens } from "@gorro/api/cookies"
import { authEndpoints } from "@gorro/api/endpoints"

import { loginFormSchema } from "./schema"
import type { LoginActionState, LoginResponse } from "./types"

export async function performLogin(
  redirectTo: string,
  formData: FormData
): Promise<LoginActionState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  }

  const parsed = loginFormSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: NonNullable<LoginActionState["fieldErrors"]> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key === "email") fieldErrors.email = issue.message
      if (key === "password") fieldErrors.password = issue.message
    }
    return { fieldErrors }
  }

  const { email, password } = parsed.data

  try {
    const res = await post<LoginResponse>(authEndpoints.login, {
      email,
      password,
    })
    await setAuthTokens(res.data)
    redirect(redirectTo)
  } catch (e) {
    unstable_rethrow(e)
    if (isApiError(e)) {
      const msg =
        e.message ||
        (e.status === 401
          ? "Invalid email or password"
          : "Something went wrong. Try again.")
      return { error: msg }
    }
    throw e
  }
}
