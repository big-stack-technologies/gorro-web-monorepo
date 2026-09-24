import { NextResponse } from "next/server"

import { removeAuthTokens } from "@gorro/api/cookies"
import { routes } from "@/lib/routes"

/** Clears session cookies in the browser response, then redirects to login. */
export async function GET(request: Request) {
  await removeAuthTokens()
  return NextResponse.redirect(new URL(routes.public.login, request.url))
}

/** Clears session cookies (JSON/API callers). */
export async function POST() {
  await removeAuthTokens()
  return new NextResponse(null, { status: 204 })
}
