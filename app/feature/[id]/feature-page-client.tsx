"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FeatureDetail } from "@/components/feature-detail"
import type { Feature } from "@/lib/data"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

export function FeaturePageClient({ feature }: { feature: Feature }) {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <RequireAuth>
      <div className="min-h-screen bg-white">
        <Sidebar
          competitor={competitor}
          onCompetitorChange={setCompetitor}
          isLoading={isSwitching}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="lg:pl-64">
          <TopBar
            title="Feature Detail"
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />

          <main className="p-4 sm:p-6">
            {isSwitching ? <PageLoader /> : <FeatureDetail feature={feature} competitor={competitor} />}
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
