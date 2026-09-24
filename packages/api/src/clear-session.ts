import { headers } from "next/headers"

/**
 * Clears auth cookies via the logout Route Handler so deletion runs in an allowed
 * Next.js context. Use from axios (including during RSC prefetch) instead of
 * calling {@link removeAuthTokens} directly.
 */
export async function clearSessionCookiesViaRoute(): Promise<void> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  const origin = host ? `${proto}://${host}` : "http://localhost:3000"
  const cookie = h.get("cookie") ?? ""

  await fetch(`${origin}/api/auth/logout`, {
    method: "POST",
    headers: cookie ? { cookie } : {},
  })
}
