"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { type Feature, getCompetitorPriority } from "@/lib/data"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, Columns3 } from "lucide-react"
import { useFeatureAssignments } from "@/components/feature-assignments-provider"

interface RoadmapViewProps {
  competitor: "semrush" | "peec"
}

export function RoadmapView({ competitor }: RoadmapViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")
  const competitorLabel = competitor === "semrush" ? "SEMrush" : "peec"
  const { features } = useFeatureAssignments()
  const initialView = searchParams.get("view") === "kanban" ? "kanban" : "timeline"
  const [activeTab, setActiveTab] = useState(initialView)

  const sprintFeatures = {
    1: features.filter((f) => f.sprint === 1),
    2: features.filter((f) => f.sprint === 2),
    3: features.filter((f) => f.sprint === 3),
  }

  const effortToPoints = (effort: string) => (effort === "S" ? 1 : effort === "M" ? 3 : 5)

  const getSprintVelocity = (sprint: number) => {
    const list = sprintFeatures[sprint as keyof typeof sprintFeatures]
    const completed = list.filter((f) => (f as any).status === "completed")
    const points = completed.reduce((sum, f) => sum + effortToPoints(f.effort), 0)
    return { points, completedCount: completed.length, total: list.length }
  }

  const kanbanColumns = {
    backlog: features.filter((f) => f.roadmapStatus === "not_planned" && f.priorityScore >= 80),
    planned: features.filter((f) => f.roadmapStatus === "planned"),
    in_progress: features.filter((f) => f.roadmapStatus === "in_progress"),
    shipped: features.filter((f) => f.roadmapStatus === "shipped"),
  }

  useEffect(() => {
    const view = searchParams.get("view")
    if ((view === "timeline" || view === "kanban") && view !== activeTab) {
      setActiveTab(view)
    }
  }, [searchParams, activeTab])

  const handleTabChange = (value: string) => {
    const next = value === "kanban" ? "kanban" : "timeline"
    setActiveTab(next)

    const params = new URLSearchParams(searchParams.toString())
    params.set("view", next)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const FeatureCard = ({ feature, isHighlighted }: { feature: Feature; isHighlighted: boolean }) => {
    const isGap = feature.seoSpace < feature[competitor]
    const priorityScore = getCompetitorPriority(feature, competitor)
    const isCompleted = (feature as any).status === "completed"

    return (
      <Card
        onClick={() => router.push(`/feature/${feature.id}`)}
        className={cn(
          "cursor-pointer transition-all hover:shadow-sm hover:border-foreground/20 border border-border",
          isHighlighted && "ring-2 ring-foreground ring-offset-2 animate-pulse",
          isCompleted && "bg-muted/40",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-medium text-sm leading-tight">{feature.name}</h4>
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground text-background font-semibold text-xs shrink-0">
              {priorityScore}
            </span>
          </div>

          <span className="text-xs text-muted-foreground">{feature.category}</span>

          <div className="flex items-center gap-2 mt-3">
            {isGap && (
              <Badge
                variant="outline"
                className="text-xs border-status-behind/50 text-status-behind bg-status-behind/10"
              >
                Gap vs {competitorLabel}
              </Badge>
            )}
            {!isGap && feature.seoSpace > feature[competitor] && (
              <Badge variant="outline" className="text-xs border-status-ahead/50 text-status-ahead bg-status-ahead/10">
                Advantage vs {competitorLabel}
              </Badge>
            )}

            {isCompleted && (
              <Badge variant="secondary" className="text-xs">Completed</Badge>
            )}

            <div className="flex items-center gap-1 ml-auto">
              {feature.semrush > feature.seoSpace && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-muted text-foreground text-xs font-bold">
                  S
                </span>
              )}
              {feature.peec > feature.seoSpace && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-muted text-foreground text-xs font-bold">
                  P
                </span>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Product Roadmap</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Click any card to view feature details</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline View
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Columns3 className="h-4 w-4" />
              Kanban View
            </TabsTrigger>
          </TabsList>

          {/* Timeline View */}
          <TabsContent value="timeline" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((sprint) => (
                <div key={sprint} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm",
                        sprint === 1
                          ? "bg-foreground text-background"
                          : sprint === 2
                            ? "bg-muted-foreground text-background"
                            : "bg-muted text-foreground",
                      )}
                    >
                      {sprint}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Sprint {sprint}</h3>
                      <p className="text-xs text-muted-foreground">
                        {sprintFeatures[sprint as keyof typeof sprintFeatures].length} features
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Velocity: {getSprintVelocity(sprint).points} pts · Completed: {getSprintVelocity(sprint).completedCount} /
                        {getSprintVelocity(sprint).total}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {sprintFeatures[sprint as keyof typeof sprintFeatures].map((feature) => (
                      <FeatureCard key={feature.id} feature={feature} isHighlighted={feature.id === highlightId} />
                    ))}
                    {sprintFeatures[sprint as keyof typeof sprintFeatures].length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
                        No features scheduled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Kanban View */}
          <TabsContent value="kanban" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(kanbanColumns).map(([status, items]) => {
                const labels = {
                  backlog: "Backlog (High Priority)",
                  planned: "Planned",
                  in_progress: "In Progress",
                  shipped: "Shipped",
                }

                return (
                  <div key={status} className="space-y-3">
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{labels[status as keyof typeof labels]}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {items.length}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 min-h-[200px]">
                      {items.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} isHighlighted={feature.id === highlightId} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
