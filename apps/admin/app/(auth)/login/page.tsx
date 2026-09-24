"use client"

import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@gorro/auth/login-form"

import { loginAction } from "@/features/auth/actions"
import { routes } from "@/lib/routes"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={routes.home}
          className="flex items-center justify-center self-center"
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
            alt=""
            width={161}
            height={40}
            className="hidden h-6 w-auto dark:block"
            aria-hidden
            priority
          />
        </Link>
        <LoginForm action={loginAction} />
      </div>
    </div>
  )
}
