"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FeatureDetail } from "@/components/feature-detail"
import type { Feature } from "@/lib/data"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

export function FeaturePageClient({ feature }: { feature: Feature }) {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Sidebar competitor={competitor} onCompetitorChange={setCompetitor} isLoading={isSwitching} />

        <div className="pl-64">
          <TopBar title="Feature Detail" />

          <main className="p-6">
            {isSwitching ? <PageLoader /> : <FeatureDetail feature={feature} competitor={competitor} />}
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
