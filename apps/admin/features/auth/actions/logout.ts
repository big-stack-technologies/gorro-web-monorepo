"use server"

import { performLogout } from "@gorro/auth/logout"

import { routes } from "@/lib/routes"

export async function logoutAction() {
  return performLogout(routes.public.login)
}
