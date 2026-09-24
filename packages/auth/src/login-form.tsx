"use client"

import { useActionState } from "react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Input } from "@gorro/ui/components/ui/input"
import { cn } from "@gorro/ui/utils"

import type { LoginAction } from "./types"

export function LoginForm({
  action,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  action: LoginAction
}) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {state.error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </div>
            ) : null}
            <FieldGroup>
              <Field data-invalid={!!state.fieldErrors?.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  aria-invalid={!!state.fieldErrors?.email}
                />
                {state.fieldErrors?.email ? (
                  <FieldError>{state.fieldErrors.email}</FieldError>
                ) : null}
              </Field>
              <Field data-invalid={!!state.fieldErrors?.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!state.fieldErrors?.password}
                />
                {state.fieldErrors?.password ? (
                  <FieldError>{state.fieldErrors.password}</FieldError>
                ) : null}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Signing in…" : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
