import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  REENGAGEMENT_CAMPAIGN_OPTIONS,
  REENGAGEMENT_CHANNEL_OPTIONS,
} from "@/features/reengagement/constants"

export const reengagementNudgesTableFilters: DataTableFilterField[] = [
  {
    type: "select",
    param: "campaign",
    label: "Campaign",
    placeholder: "Campaign",
    options: REENGAGEMENT_CAMPAIGN_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All campaigns",
  },
  {
    type: "select",
    param: "channel",
    label: "Channel",
    placeholder: "Channel",
    options: REENGAGEMENT_CHANNEL_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All channels",
  },
  {
    type: "text",
    param: "email",
    label: "Email",
    placeholder: "Search email",
  },
  {
    type: "text",
    param: "phone",
    label: "Phone",
    placeholder: "Search phone",
  },
  {
    type: "date",
    param: "from",
    label: "From",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "to",
    label: "To",
    boundary: "endOfDay",
  },
]
