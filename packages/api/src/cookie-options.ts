/** Default lifetime for refresh token cookie (30 days), in seconds */
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30
const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

export function accessTokenCookieOptions(maxAgeSeconds: number) {
  return {
    ...baseOptions,
    maxAge: maxAgeSeconds,
  }
}

export function refreshTokenCookieOptions() {
  return {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  }
}
