"use client"

import { AuthNavUser } from "@gorro/auth/auth-nav-user"

import { logoutAction } from "@/features/auth/actions"

export function NavUserProfile() {
  return <AuthNavUser onLogout={logoutAction} />
}
