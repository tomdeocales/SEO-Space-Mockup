"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FeatureDetail } from "@/components/feature-detail"
import type { Feature } from "@/lib/data"
import { PageLoader } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/toast-banner"

export function FeaturePageClient({ feature }: { feature: Feature }) {
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
    <div className="min-h-screen bg-background">
      <Sidebar competitor={competitor} onCompetitorChange={handleCompetitorChange} isLoading={isLoading} />

      <div className="pl-64">
        <TopBar title="Feature Detail" />

        <main className="p-6">
          {isLoading ? <PageLoader /> : <FeatureDetail feature={feature} competitor={competitor} />}
        </main>
      </div>
    </div>
  )
}
