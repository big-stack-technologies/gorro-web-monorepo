"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Input } from "@gorro/ui/components/ui/input"
import { getFriendlyBvnErrorMessage } from "@/features/users/bvn-error-message"
import {
  verifyUserBvnFormSchema,
  type VerifyUserBvnFormValues,
} from "@/features/users/schema"
import type { User, VerifyUserBvnData } from "@/features/users/types"
import { useVerifyUserBvn } from "@/features/users/usecases"
import { cn } from "@gorro/ui/utils"

type UserBvnVerificationPanelProps = {
  user: User
  canVerify: boolean
}

function BvnVerificationResult({ data }: { data: VerifyUserBvnData }) {
  const { verificationStatus, response } = data
  const isVerified = verificationStatus.toLowerCase() === "verified"
  const photoSrc = response.pixBase64
    ? `data:image/jpeg;base64,${response.pixBase64}`
    : null

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border p-4",
        isVerified
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
          : "border-border bg-muted/40"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Verification result</span>
        <Badge variant={isVerified ? "outline" : "secondary"}>
          {verificationStatus}
        </Badge>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">First name</dt>
          <dd className="font-medium">{response.firstName || "—"}</dd>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">Middle name</dt>
          <dd className="font-medium">{response.middleName || "—"}</dd>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">Last name</dt>
          <dd className="font-medium">{response.lastName || "—"}</dd>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">BVN</dt>
          <dd className="font-medium">{response.bvn}</dd>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">Gender</dt>
          <dd className="font-medium capitalize">{response.gender}</dd>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">Date of birth</dt>
          <dd className="font-medium">{response.dateOfBirth}</dd>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-x-3">
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-medium">{response.phoneNo}</dd>
        </div>
      </dl>

      {photoSrc ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Photo</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt="BVN verification photo"
            className="max-h-40 rounded-md border object-contain"
          />
        </div>
      ) : null}
    </div>
  )
}

export function UserBvnVerificationPanel({
  user,
  canVerify,
}: UserBvnVerificationPanelProps) {
  const form = useForm<VerifyUserBvnFormValues>({
    resolver: standardSchemaResolver(verifyUserBvnFormSchema),
    defaultValues: { bvn: user.bvn ?? "" },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    reset({ bvn: user.bvn ?? "" })
  }, [user.bvn, reset])

  const mutation = useVerifyUserBvn(user.id)
  const result = mutation.data
  const errorMessage = mutation.isError
    ? getFriendlyBvnErrorMessage(mutation.error)
    : null

  const onSubmit = (values: VerifyUserBvnFormValues) => {
    mutation.mutate({ bvn: values.bvn })
  }

  if (!canVerify) {
    return (
      <p className="text-sm text-muted-foreground">
        BVN verification is available to super admins and moderators only.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={errors.bvn ? true : undefined}>
            <FieldLabel htmlFor={`bvn-${user.id}`}>BVN</FieldLabel>
            <FieldDescription>
              Enter an 11-digit Bank Verification Number to verify with Fincra.
            </FieldDescription>
            <Input
              id={`bvn-${user.id}`}
              inputMode="numeric"
              maxLength={11}
              placeholder="22345678901"
              aria-invalid={!!errors.bvn}
              {...register("bvn")}
            />
            <FieldError errors={[errors.bvn]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
          ) : null}
          Verify BVN
        </Button>
      </form>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errorMessage}
        </div>
      ) : null}

      {result ? <BvnVerificationResult data={result} /> : null}
    </div>
  )
}
