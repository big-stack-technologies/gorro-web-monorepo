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

  if (pathname === routes.home) {
    return NextResponse.redirect(
      new URL(routes.protected.admin.base, request.url)
    )
  }

  const isProtectedRoute = pathname.startsWith(routes.protected.admin.base)
  const isPublicAuthRoute = pathname === routes.public.login

  if (isProtectedRoute && !authenticated) {
    const loginUrl = new URL(routes.public.login, request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicAuthRoute && authenticated) {
    return NextResponse.redirect(
      new URL(routes.protected.admin.base, request.url)
    )
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
