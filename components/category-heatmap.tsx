"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { categories, getCategoryScore } from "@/lib/data"
import { useRouter } from "next/navigation"

interface CategoryHeatmapProps {
  competitor: "semrush" | "peec"
  compact?: boolean
}

export function CategoryHeatmap({ competitor, compact = false }: CategoryHeatmapProps) {
  const router = useRouter()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-status-ahead"
    if (score >= 50) return "bg-status-partial"
    return "bg-status-behind"
  }

  const getBarWidth = (score: number) => {
    return `${Math.max(score, 5)}%`
  }

  return (
    <Card className="border border-border h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Category Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {compact ? "Score by category" : "Click a category to view detailed comparison"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "grid gap-3",
            compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {categories.map((category) => {
            const score = getCategoryScore(category, competitor)
            return (
              <button
                key={category}
                onClick={() => router.push(`/feature-map?category=${encodeURIComponent(category)}`)}
                className={cn(
                  "group relative rounded-lg border border-border bg-card text-left transition-all",
                  "hover:border-foreground/20 hover:shadow-sm cursor-pointer",
                  compact ? "p-3 flex items-center gap-4" : "p-4",
                )}
              >
                <div className={cn("flex-1", compact && "flex items-center justify-between mb-0")}>
                  <div className={cn("flex items-center justify-between", !compact && "mb-3")}>
                    <span className="text-sm font-medium text-foreground">{category}</span>
                    {!compact && (
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          score >= 80
                            ? "text-status-ahead"
                            : score >= 50
                              ? "text-status-partial"
                              : "text-status-behind",
                        )}
                      >
                        {score}%
                      </span>
                    )}
                  </div>
                  {compact ? (
                    <div className="flex items-center gap-3 ml-4 flex-1 max-w-[120px]">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", getScoreColor(score))}
                          style={{ width: getBarWidth(score) }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right">{score}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", getScoreColor(score))}
                          style={{ width: getBarWidth(score) }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {score >= 80 ? "On par or ahead" : score >= 50 ? "Slightly behind" : "Significantly behind"}
                      </p>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
