"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { KPICard } from "@/components/kpi-card"
import { CategoryHeatmap } from "@/components/category-heatmap"
import { GapsTable } from "@/components/gaps-table"
import { getOverallParityScore, getFeaturesBehind, getFeaturesAhead, getHighPriorityGaps } from "@/lib/data"
import { PageLoader } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/toast-banner"
import { RequireAuth } from "@/components/require-auth"

export default function ParityOverview() {
  const [competitor, setCompetitor] = useState<"semrush" | "peec">("semrush")
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const parityScore = getOverallParityScore(competitor)
  const featuresBehind = getFeaturesBehind(competitor)
  const featuresAhead = getFeaturesAhead(competitor)
  const highPriorityGaps = getHighPriorityGaps(competitor)

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
          <TopBar title="Competitive Parity Overview" />

          <main className="p-6 space-y-6">
            {isLoading ? (
              <PageLoader />
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard
                    title="Overall Parity Score"
                    value={parityScore}
                    subtitle="/100"
                    trend={parityScore >= 70 ? "up" : parityScore >= 50 ? "neutral" : "down"}
                    trendValue={parityScore >= 70 ? "+12%" : "-8%"}
                    trendDescription={parityScore >= 70 ? "Good standing overall" : "Needs improvement"}
                  />
                  <KPICard
                    title="Features Behind"
                    value={featuresBehind}
                    trend="down"
                    trendValue={`-${featuresBehind > 10 ? "15%" : "8%"}`}
                    trendDescription={`vs ${competitor === "semrush" ? "SEMrush" : "peec"}`}
                  />
                  <KPICard
                    title="Features Ahead"
                    value={featuresAhead}
                    trend="up"
                    trendValue={`+${featuresAhead}`}
                    trendDescription="Competitive advantage"
                  />
                  <KPICard
                    title="High Priority Gaps"
                    value={highPriorityGaps}
                    trend="neutral"
                    trendValue="Priority ≥85"
                    trendDescription="Requires attention"
                  />
                </div>

                {/* Category Heatmap */}
                <CategoryHeatmap competitor={competitor} />

                {/* Top Gaps Table */}
                <GapsTable competitor={competitor} />
              </>
            )}
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
