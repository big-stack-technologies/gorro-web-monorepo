import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import {
  AJO_CREATED_BY_FILTER_OPTIONS,
  AJO_GROUP_STATUS_FILTER_OPTIONS,
  AJO_GROUP_TYPE_FILTER_OPTIONS,
} from "@/features/ajo/constants"

export const ajoGroupsTableFilters: DataTableFilterField[] = [
  {
    type: "text",
    param: "search",
    label: "Search",
    placeholder: "Name or code",
  },
  {
    type: "select",
    param: "type",
    label: "Type",
    placeholder: "Type",
    options: AJO_GROUP_TYPE_FILTER_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All types",
  },
  {
    type: "select",
    param: "status",
    label: "Status",
    placeholder: "Status",
    options: AJO_GROUP_STATUS_FILTER_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All statuses",
  },
  {
    type: "select",
    param: "createdByAdmin",
    label: "Creator",
    placeholder: "Creator",
    options: AJO_CREATED_BY_FILTER_OPTIONS.map((option) => ({ ...option })),
    emptyLabel: "All creators",
  },
]
