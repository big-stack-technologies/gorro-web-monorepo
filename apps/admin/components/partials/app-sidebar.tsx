"use client"

import * as React from "react"

import { NavMain } from "@gorro/ui/components/nav-main"
import { NavSecondary } from "@gorro/ui/components/nav-secondary"
import { NavUserProfile } from "@/components/partials/nav-user-profile"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@gorro/ui/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  ArrowLeftRightIcon,
  BanknoteIcon,
  UsersRoundIcon,
  PiggyBankIcon,
  FlagIcon,
  HandCoinsIcon,
  Layers3Icon,
  CircleDollarSignIcon,
  BellRingIcon,
  IdCardIcon,
  HouseIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { canManageClusters, canManageReengagement, isPartnerOnly } from "@/features/auth/access"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { routes } from "@/lib/routes"

const data = {
  navMain: [
    {
      items: [
        {
          title: "Dashboard",
          url: routes.protected.admin.base,
          icon: <LayoutDashboardIcon />,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Users",
          url: routes.protected.users.base,
          icon: <UsersIcon />,
        },
        {
          title: "Transactions",
          url: routes.protected.transactions.base,
          icon: <ArrowLeftRightIcon />,
        },
        {
          title: "Withdrawal requests",
          url: routes.protected.withdrawalRequests.base,
          icon: <BanknoteIcon />,
        },
        {
          title: "NIN reviews",
          url: routes.protected.kycNinReviews.base,
          icon: <IdCardIcon />,
        },
        {
          title: "Address reviews",
          url: routes.protected.kycAddressReviews.base,
          icon: <HouseIcon />,
        },
        {
          title: "Cluster withdrawals",
          url: routes.protected.clusters.withdrawals,
          icon: <CircleDollarSignIcon />,
        },
        {
          title: "Referrals",
          url: routes.protected.referrals.base,
          icon: <UsersRoundIcon />,
        },
      ],
    },
    {
      title: "Products",
      items: [
        {
          title: "Savings",
          url: routes.protected.savings.base,
          icon: <PiggyBankIcon />,
        },
        {
          title: "Ajo",
          url: routes.protected.ajo.base,
          icon: <HandCoinsIcon />,
        },
        {
          title: "Clusters",
          url: routes.protected.clusters.base,
          icon: <Layers3Icon />,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Feature flags",
          url: routes.protected.featureFlags.base,
          icon: <FlagIcon />,
        },
        {
          title: "Re-engagement",
          url: routes.protected.reengagement.base,
          icon: <BellRingIcon />,
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: (
  //       <DatabaseIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: (
  //       <FileChartColumnIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: (
  //       <FileIcon
  //       />
  //     ),
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useGetProfile()
  const partnerOnly = isPartnerOnly(profile?.roles)
  const clustersAllowed = canManageClusters(profile?.roles)
  const reengagementAllowed = canManageReengagement(profile?.roles)

  const navMain = data.navMain
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (partnerOnly) {
          return (
            item.url === routes.protected.admin.base ||
            item.url === routes.protected.savings.base
          )
        }
        if (
          item.url === routes.protected.clusters.base ||
          item.url === routes.protected.clusters.withdrawals
        ) {
          return clustersAllowed
        }
        if (item.url === routes.protected.reengagement.base) {
          return reengagementAllowed
        }
        return true
      }),
    }))
    .filter((section) => section.items.length > 0)

  const navSecondary = partnerOnly ? [] : data.navSecondary

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link
                href={routes.protected.admin.base}
                className="flex items-center gap-2"
              >
                <Image
                  src="/logos/gorro-logo.svg"
                  alt="Gorro"
                  width={96}
                  height={24}
                  className="h-5 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logos/gorro-logo-white.svg"
                  alt=""
                  width={161}
                  height={40}
                  className="hidden h-5 w-auto dark:block"
                  aria-hidden
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={navMain} homeUrl={routes.protected.admin.base} />
        {/* <NavDocuments items={data.documents} /> */}
        {navSecondary.length > 0 ? (
          <NavSecondary items={navSecondary} className="mt-auto" />
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
