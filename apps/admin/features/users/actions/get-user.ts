"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { UserDetails } from "@/features/users/types"

export async function getUserAction(id: string): Promise<UserDetails> {
  const { data } = await get<UserDetails>(endpoints.admin.userById(id))
  return data
}
