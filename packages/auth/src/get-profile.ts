"use server"

import { get } from "@gorro/api/client"
import { authEndpoints } from "@gorro/api/endpoints"

import type { AuthProfile } from "./types"

export async function getProfileAction(): Promise<AuthProfile> {
  const { data } = await get<AuthProfile>(authEndpoints.me)
  return data
}
