"use client"

import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { RoadmapView } from "@/components/roadmap-view"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

function RoadmapContent() {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()

  return (
    <RequireAuth>
      <div className="min-h-screen bg-white">
        <Sidebar competitor={competitor} onCompetitorChange={setCompetitor} isLoading={isSwitching} />

        <div className="pl-64">
          <TopBar title="Product Roadmap" />

          <main className="p-6">{isSwitching ? <PageLoader /> : <RoadmapView competitor={competitor} />}</main>
        </div>
      </div>
    </RequireAuth>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <PageLoader />
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  )
}
