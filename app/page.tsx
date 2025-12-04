"use client"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ParityRadarChart } from "@/components/parity-radar-chart"
import { KPICard } from "@/components/kpi-card"
import { CategoryHeatmap } from "@/components/category-heatmap"
import { GapsTable } from "@/components/gaps-table"
import { getOverallParityScore, getFeaturesBehind, getFeaturesAhead, getHighPriorityGaps } from "@/lib/data"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

export default function ParityOverview() {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()

  const parityScore = getOverallParityScore(competitor)
  const featuresBehind = getFeaturesBehind(competitor)
  const featuresAhead = getFeaturesAhead(competitor)
  const highPriorityGaps = getHighPriorityGaps(competitor)

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Sidebar competitor={competitor} onCompetitorChange={setCompetitor} isLoading={isSwitching} />

        <div className="pl-64">
          <TopBar title="Competitive Parity Overview" />

          <main className="p-6 space-y-6">
            {isSwitching ? (
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
                    variant="hero"
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

                {/* Parity Analysis Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <ParityRadarChart competitor={competitor} />
                  </div>
                  <div className="lg:col-span-2">
                    <CategoryHeatmap competitor={competitor} compact />
                  </div>
                </div>

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
