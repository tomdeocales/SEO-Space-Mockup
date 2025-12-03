"use client"

import { useState, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { RoadmapView } from "@/components/roadmap-view"
import { PageLoader } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/toast-banner"
import { RequireAuth } from "@/components/require-auth"

function RoadmapContent() {
  const [competitor, setCompetitor] = useState<"semrush" | "peec">("semrush")
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleCompetitorChange = (newCompetitor: "semrush" | "peec") => {
    if (newCompetitor === competitor) return
    setIsLoading(true)
    setTimeout(() => {
      setCompetitor(newCompetitor)
      setIsLoading(false)
      showToast(`Switched to ${newCompetitor === "semrush" ? "SEMrush" : "peec"} comparison`, "info")
    }, 500)
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Sidebar competitor={competitor} onCompetitorChange={handleCompetitorChange} isLoading={isLoading} />

        <div className="pl-64">
          <TopBar title="Product Roadmap" />

          <main className="p-6">{isLoading ? <PageLoader /> : <RoadmapView competitor={competitor} />}</main>
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
