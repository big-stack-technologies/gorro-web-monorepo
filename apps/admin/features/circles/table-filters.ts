import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  CIRCLE_STATUS_OPTIONS,
  CIRCLE_VISIBILITY_OPTIONS,
} from "@/features/circles/constants"

export const circlesTableFilters: DataTableFilterField[] = [
  {
    type: "text",
    param: "search",
    label: "Search",
    placeholder: "Name, code or owner",
  },
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: CIRCLE_STATUS_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All statuses",
  },
  {
    type: "select",
    param: "visibility",
    label: "Visibility",
    placeholder: "Visibility",
    options: CIRCLE_VISIBILITY_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All visibilities",
  },
]
