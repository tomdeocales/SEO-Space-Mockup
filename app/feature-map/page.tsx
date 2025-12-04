"use client"

import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FeatureMapTable } from "@/components/feature-map-table"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

function FeatureMapContent() {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Sidebar competitor={competitor} onCompetitorChange={setCompetitor} isLoading={isSwitching} />

        <div className="pl-64">
          <TopBar title="Feature Comparison Matrix" />

          <main className="p-6">{isSwitching ? <PageLoader /> : <FeatureMapTable competitor={competitor} />}</main>
        </div>
      </div>
    </RequireAuth>
  )
}

export default function FeatureMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <PageLoader />
        </div>
      }
    >
      <FeatureMapContent />
    </Suspense>
  )
}
