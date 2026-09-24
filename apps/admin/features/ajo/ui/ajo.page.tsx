"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import { AjoConfigSection } from "@/features/ajo/ui/ajo-config-section"
import { AjoGroupsSection } from "@/features/ajo/ui/ajo-groups-section"
import { CreateAjoGroupForm } from "@/features/ajo/ui/create-ajo-group-form"

export function AjoPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Ajo"
        description="Browse groups, manage platform defaults, and create Gorro public rotating savings groups."
      />

      <Tabs defaultValue="groups" className="gap-6">
        <TabsList className="h-9 w-fit justify-start">
          <TabsTrigger value="groups" className="flex-none text-xs sm:text-sm">
            Groups
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-none text-xs sm:text-sm">
            Settings
          </TabsTrigger>
          <TabsTrigger value="create" className="flex-none text-xs sm:text-sm">
            Create group
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-0">
          <AjoGroupsSection />
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <AjoConfigSection />
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <CreateAjoGroupForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
