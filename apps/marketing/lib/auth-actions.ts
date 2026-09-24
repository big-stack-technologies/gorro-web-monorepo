"use server"

import { performLogin } from "@gorro/auth/login"
import { performLogout } from "@gorro/auth/logout"
import type { LoginActionState } from "@gorro/auth/types"

import { routes } from "@/lib/routes"

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  return performLogin(routes.home, formData)
}

export async function logoutAction() {
  return performLogout(routes.public.login)
}
