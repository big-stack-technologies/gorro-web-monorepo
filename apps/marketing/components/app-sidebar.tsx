"use client"

import Image from "next/image"
import Link from "next/link"
import {
  DownloadIcon,
  FilterIcon,
  LayoutDashboardIcon,
  Building2Icon,
  MapIcon,
  MegaphoneIcon,
  SlidersHorizontalIcon,
  TargetIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react"

import { AuthNavUser } from "@gorro/auth/auth-nav-user"
import { NavMain } from "@gorro/ui/components/nav-main"
import { Badge } from "@gorro/ui/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@gorro/ui/components/ui/sidebar"

import { logoutAction } from "@/lib/auth-actions"
import { routes } from "@/lib/routes"

const navMain = [
  {
    items: [
      {
        title: "Overview",
        url: routes.home,
        icon: <LayoutDashboardIcon />,
      },
    ],
  },
  {
    title: "CGAs",
    items: [
      {
        title: "CGAs",
        url: routes.cgas.list,
        icon: <UsersIcon />,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Funnel & trends",
        url: routes.analytics,
        icon: <FilterIcon />,
      },
      {
        title: "Targets & alerts",
        url: routes.targets,
        icon: <SlidersHorizontalIcon />,
      },
      {
        title: "Exports",
        url: routes.export,
        icon: <DownloadIcon />,
      },
    ],
  },
  {
    title: "Campaigns",
    items: [
      {
        title: "Campaigns",
        url: routes.campaigns.list,
        icon: <MegaphoneIcon />,
      },
      {
        title: "Segments",
        url: routes.segments.list,
        icon: <TargetIcon />,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        title: "Territories",
        url: routes.org.territories,
        icon: <MapIcon />,
      },
      {
        title: "Team leads",
        url: routes.org.teamLeads,
        icon: <UserCogIcon />,
      },
      {
        title: "Communities",
        url: routes.communities.list,
        icon: <Building2Icon />,
      },
    ],
  },
]

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={routes.home} className="flex items-start gap-1">
                <Image
                  src="/logos/gorro-logo.svg"
                  alt="Gorro"
                  width={96}
                  height={24}
                  className="h-5 w-auto shrink-0 dark:hidden"
                  priority
                />
                <Image
                  src="/logos/gorro-logo-white.svg"
                  alt="Gorro"
                  width={161}
                  height={40}
                  className="hidden h-5 w-auto shrink-0 dark:block"
                  priority
                />
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] leading-none tracking-wide uppercase"
                >
                  Marketing
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={navMain} homeUrl={routes.home} />
      </SidebarContent>
      <SidebarFooter>
        <AuthNavUser onLogout={logoutAction} />
      </SidebarFooter>
    </Sidebar>
  )
}
