"use client"

import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@gorro/auth/login-form"
import { Badge } from "@gorro/ui/components/ui/badge"

import { loginAction } from "@/lib/auth-actions"
import { routes } from "@/lib/routes"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={routes.home}
          className="flex items-start justify-center gap-1 self-center"
        >
          <Image
            src="/logos/gorro-logo.svg"
            alt="Gorro"
            width={96}
            height={24}
            className="h-6 w-auto dark:hidden"
            priority
          />
          <Image
            src="/logos/gorro-logo-white.svg"
            alt="Gorro"
            width={161}
            height={40}
            className="hidden h-6 w-auto dark:block"
            priority
          />
          <Badge
            variant="outline"
            className="h-4 px-1.5 text-[10px] leading-none tracking-wide uppercase"
          >
            Marketing
          </Badge>
        </Link>
        <LoginForm action={loginAction} />
      </div>
    </div>
  )
}
