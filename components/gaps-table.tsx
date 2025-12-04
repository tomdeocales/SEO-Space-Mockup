"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { features, getParityStatus, type Feature, getCompetitorPriority } from "@/lib/data"
import { useRouter } from "next/navigation"

interface GapsTableProps {
  competitor: "semrush" | "peec"
}

export function GapsTable({ competitor }: GapsTableProps) {
  const router = useRouter()
  const gaps = features
    .filter((feature) => feature.seoSpace < feature[competitor])
    .map((feature) => ({ feature, priorityScore: getCompetitorPriority(feature, competitor) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 10)

  const getStatusBadge = (feature: Feature) => {
    const status = getParityStatus(feature, competitor)
    if (status === "missing") {
      return (
        <Badge variant="outline" className="border-status-behind/50 text-status-behind bg-status-behind/10">
          Missing
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-status-partial/50 text-status-partial bg-status-partial/10">
        Partial
      </Badge>
    )
  }

  const getEffortBadge = (effort: string) => {
    return (
      <Badge variant="secondary" className="font-medium text-xs">
        {effort === "S" ? "Small" : effort === "M" ? "Medium" : "Large"}
      </Badge>
    )
  }

  const getRoadmapBadge = (status: string) => {
    const labels = {
      not_planned: "Not Planned",
      planned: "Planned",
      in_progress: "In Progress",
      shipped: "Shipped",
    }
    return (
      <Badge variant="outline" className="font-normal text-xs">
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Top 10 Priority Gaps</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Click a row to view feature details</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium text-xs uppercase tracking-wider">Feature Name</TableHead>
                <TableHead className="font-medium text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="font-medium text-xs uppercase tracking-wider text-center">Priority</TableHead>
                <TableHead className="font-medium text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-medium text-xs uppercase tracking-wider text-center">Effort</TableHead>
                <TableHead className="font-medium text-xs uppercase tracking-wider">Roadmap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gaps.map(({ feature, priorityScore }) => (
                <TableRow
                  key={feature.id}
                  onClick={() => router.push(`/feature/${feature.id}`)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium text-sm">{feature.name}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{feature.category}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-foreground text-background font-semibold text-xs">
                      {priorityScore}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(feature)}</TableCell>
                  <TableCell className="text-center">{getEffortBadge(feature.effort)}</TableCell>
                  <TableCell>{getRoadmapBadge(feature.roadmapStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
