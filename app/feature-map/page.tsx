"use client"

import { Suspense, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FeatureMapTable } from "@/components/feature-map-table"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

function FeatureMapContent() {
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
            title="Feature Comparison Matrix"
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />

          <main className="p-4 sm:p-6">{isSwitching ? <PageLoader /> : <FeatureMapTable competitor={competitor} />}</main>
        </div>
      </div>
    </RequireAuth>
  )
}

export default function FeatureMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <PageLoader />
        </div>
      }
    >
      <FeatureMapContent />
    </Suspense>
  )
}
