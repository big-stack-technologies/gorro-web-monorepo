import { cookies } from "next/headers"
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "./cookie-options"

type CookieStore = Awaited<ReturnType<typeof cookies>>
type SetCookieOptions = Parameters<CookieStore["set"]>[2]

export async function getCookie(name: string) {
  const store = await cookies()
  return store.get(name)?.value
}

export async function setCookie(
  name: string,
  value: string,
  options?: SetCookieOptions
) {
  const store = await cookies()
  store.set(name, value, options)
}

export async function removeCookie(name: string) {
  const store = await cookies()
  store.delete(name)
}

export const cookieNames = {
  accessToken: "auth_token",
  refreshToken: "refresh_token",
} as const

/** Payload matching the login API response for persisting session cookies */
export type AuthTokensPayload = {
  accessToken: string
  refreshToken: string
  /** Access token lifetime in seconds */
  expiresIn: number
}

export async function getAuthAccessToken() {
  return getCookie(cookieNames.accessToken)
}

export async function getAuthRefreshToken() {
  return getCookie(cookieNames.refreshToken)
}

export async function setAuthTokens(payload: AuthTokensPayload) {
  await setCookie(
    cookieNames.accessToken,
    payload.accessToken,
    accessTokenCookieOptions(payload.expiresIn)
  )
  await setCookie(
    cookieNames.refreshToken,
    payload.refreshToken,
    refreshTokenCookieOptions()
  )
}

export async function removeAuthTokens() {
  await removeCookie(cookieNames.accessToken)
  await removeCookie(cookieNames.refreshToken)
}
