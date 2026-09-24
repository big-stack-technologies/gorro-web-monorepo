"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { DatePicker } from "@gorro/ui/components/date-picker"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Input } from "@gorro/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"

import { useTerritories } from "@/features/cgas/usecases"
import {
  campaignFormSchema,
  campaignFormValuesToPayload,
  campaignToFormValues,
  NONE_COMMUNITY,
  NONE_TERRITORY,
  type CampaignFormValues,
} from "@/features/campaigns/schema"
import type {
  MarketingCampaign,
  MarketingCommunityListItem,
} from "@/features/campaigns/types"
import {
  useCommunities,
  useCreateCampaign,
  useUpdateCampaign,
} from "@/features/campaigns/usecases"

type CampaignFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign?: MarketingCampaign | null
}

const emptyFormValues: CampaignFormValues = campaignToFormValues(null)

export function CampaignFormDialog({
  open,
  onOpenChange,
  campaign,
}: CampaignFormDialogProps) {
  const isEdit = campaign != null
  const createMutation = useCreateCampaign()
  const updateMutation = useUpdateCampaign(campaign?.id ?? "")
  const territories = useTerritories()
  const communities = useCommunities()

  const form = useForm<CampaignFormValues>({
    resolver: standardSchemaResolver(campaignFormSchema),
    defaultValues: emptyFormValues,
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = form

  // eslint-disable-next-line react-hooks/incompatible-library
  const territoryId = watch("territoryId")
  const communityId = watch("communityId")
  const startsOn = watch("startsOn")

  useEffect(() => {
    if (open) {
      reset(campaignToFormValues(campaign))
    }
  }, [open, campaign, reset])

  const pending = createMutation.isPending || updateMutation.isPending

  const filteredCommunities = filterCommunitiesForTerritory(
    communities.data ?? [],
    territoryId,
    communityId
  )

  const onSubmit = (values: CampaignFormValues) => {
    const payload = campaignFormValuesToPayload(values)
    const onSuccess = () => onOpenChange(false)
    if (isEdit && campaign) {
      updateMutation.mutate(payload, { onSuccess })
    } else {
      createMutation.mutate(payload, { onSuccess })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>{isEdit ? "Edit campaign" : "New campaign"}</DialogTitle>
          <DialogDescription>
            Track field and digital campaigns with optional territory scope and
            spend for cost-per-outcome metrics.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="px-4 py-4">
          <FieldGroup>
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="campaign-name">Name</FieldLabel>
              <Input
                id="campaign-name"
                aria-invalid={!!errors.name}
                disabled={pending}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={errors.startsOn ? true : undefined}>
                <FieldLabel htmlFor="campaign-starts">Starts on</FieldLabel>
                <Controller
                  name="startsOn"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="campaign-starts"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={pending}
                      invalid={!!errors.startsOn}
                    />
                  )}
                />
                <FieldError errors={[errors.startsOn]} />
              </Field>

              <Field data-invalid={errors.endsOn ? true : undefined}>
                <FieldLabel htmlFor="campaign-ends">Ends on</FieldLabel>
                <Controller
                  name="endsOn"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="campaign-ends"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={pending}
                      invalid={!!errors.endsOn}
                      minDate={
                        startsOn
                          ? new Date(`${startsOn}T12:00:00`)
                          : undefined
                      }
                    />
                  )}
                />
                <FieldError errors={[errors.endsOn]} />
              </Field>
            </div>

            <Field data-invalid={errors.territoryId ? true : undefined}>
              <FieldLabel htmlFor="campaign-territory">
                Territory (optional)
              </FieldLabel>
              <Controller
                name="territoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      const currentCommunityId = getValues("communityId")
                      const filtered = filterCommunitiesForTerritory(
                        communities.data ?? [],
                        value
                      )
                      const communityStillValid =
                        currentCommunityId === NONE_COMMUNITY ||
                        filtered.some((c) => c.id === currentCommunityId)
                      if (!communityStillValid) {
                        setValue("communityId", NONE_COMMUNITY, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    disabled={pending}
                  >
                    <SelectTrigger
                      id="campaign-territory"
                      className="w-full min-w-0"
                      aria-invalid={!!errors.territoryId}
                    >
                      <SelectValue placeholder="All territories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_TERRITORY}>
                        All territories
                      </SelectItem>
                      {(territories.data ?? []).map((territory) => (
                        <SelectItem key={territory.id} value={territory.id}>
                          {territory.name} ({territory.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.territoryId]} />
            </Field>

            <Field data-invalid={errors.communityId ? true : undefined}>
              <FieldLabel htmlFor="campaign-community">
                Community (optional)
              </FieldLabel>
              <Controller
                name="communityId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending}
                  >
                    <SelectTrigger
                      id="campaign-community"
                      className="w-full min-w-0"
                      aria-invalid={!!errors.communityId}
                    >
                      <SelectValue placeholder="No community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_COMMUNITY}>No community</SelectItem>
                      {filteredCommunities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>
                          {communityOptionLabel(community)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.communityId]} />
            </Field>

            <Field data-invalid={errors.targetAudience ? true : undefined}>
              <FieldLabel htmlFor="campaign-audience">Target audience</FieldLabel>
              <Input
                id="campaign-audience"
                placeholder="e.g. campus ambassadors, Lagos island"
                aria-invalid={!!errors.targetAudience}
                disabled={pending}
                {...register("targetAudience")}
              />
              <FieldError errors={[errors.targetAudience]} />
            </Field>

            <Field data-invalid={errors.cost ? true : undefined}>
              <FieldLabel htmlFor="campaign-cost">
                Cost (NGN, optional)
              </FieldLabel>
              <Input
                id="campaign-cost"
                type="number"
                min={0}
                step="any"
                aria-invalid={!!errors.cost}
                disabled={pending}
                {...register("cost")}
              />
              <FieldError errors={[errors.cost]} />
            </Field>
          </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              {isEdit ? "Save changes" : "Create campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function filterCommunitiesForTerritory(
  communities: MarketingCommunityListItem[],
  territoryId: string,
  selectedCommunityId?: string
) {
  if (territoryId === NONE_TERRITORY) {
    return communities
  }
  return communities.filter(
    (community) =>
      community.territory == null ||
      community.territory.id === territoryId ||
      community.id === selectedCommunityId
  )
}

function communityOptionLabel(community: MarketingCommunityListItem) {
  const secondary =
    community.location?.trim() ||
    community.territory?.name ||
    community.territory?.code
  return secondary ? `${community.name} — ${secondary}` : community.name
}
