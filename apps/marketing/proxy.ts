import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { cookieNames } from "@gorro/api/cookies"

import { routes } from "@/lib/routes"

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(cookieNames.accessToken)
  return token !== undefined && token.value !== ""
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authenticated = isAuthenticated(request)
  const isLoginRoute = pathname === routes.public.login

  if (!isLoginRoute && !authenticated) {
    const loginUrl = new URL(routes.public.login, request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginRoute && authenticated) {
    return NextResponse.redirect(new URL(routes.home, request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
