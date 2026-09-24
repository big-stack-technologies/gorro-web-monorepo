"use server"

import { performLogin } from "@gorro/auth/login"
import type { LoginActionState } from "@gorro/auth/types"

import { routes } from "@/lib/routes"

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  return performLogin(routes.protected.admin.base, formData)
}
