"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { features, categories, type Feature } from "@/lib/data"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, X, Circle, Search, Filter, RotateCcw } from "lucide-react"
import { useToast } from "@/components/ui/toast-banner"

interface FeatureMapTableProps {
  competitor: "semrush" | "peec"
}

export function FeatureMapTable({ competitor }: FeatureMapTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const initialCategory = searchParams.get("category") || "all"

  const [categoryFilter, setCategoryFilter] = useState(initialCategory)
  const [parityFilter, setParityFilter] = useState("all")
  const [priorityRange, setPriorityRange] = useState([0, 100])
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersApplied, setFiltersApplied] = useState(false)

  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      if (categoryFilter !== "all" && feature.category !== categoryFilter) return false
      if (parityFilter === "missing" && feature.seoSpace !== 0) return false
      if (parityFilter === "partial" && feature.seoSpace !== 1) return false
      if (parityFilter === "full" && feature.seoSpace !== 2) return false
      if (feature.priorityScore < priorityRange[0] || feature.priorityScore > priorityRange[1]) return false
      if (searchQuery && !feature.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [categoryFilter, parityFilter, priorityRange, searchQuery])

  const handleApplyFilters = () => {
    setFiltersApplied(true)
    showToast(`Filters applied. Showing ${filteredFeatures.length} features.`, "success")
  }

  const handleClearFilters = () => {
    setCategoryFilter("all")
    setParityFilter("all")
    setPriorityRange([0, 100])
    setSearchQuery("")
    setFiltersApplied(false)
    showToast("Filters cleared", "info")
  }

  const getImplementationIcon = (value: 0 | 1 | 2) => {
    if (value === 2) return <Check className="h-4 w-4 text-status-ahead" />
    if (value === 1) return <Circle className="h-4 w-4 text-status-partial fill-status-partial/30" />
    return <X className="h-4 w-4 text-status-behind" />
  }

  const getTooltipContent = (feature: Feature, tool: "seoSpace" | "semrush" | "peec") => {
    const value = feature[tool]
    const status = value === 2 ? "Full" : value === 1 ? "Partial" : "Missing"

    if (tool === "semrush") {
      return `SEMrush: ${status} implementation — ${feature.semrushDescription}`
    }
    if (tool === "peec") {
      return `peec: ${status} implementation — ${feature.peecDescription}`
    }
    return `SEO Space: ${status} implementation — ${feature.description}`
  }

  // Check if any filters are active
  const hasActiveFilters =
    categoryFilter !== "all" ||
    parityFilter !== "all" ||
    priorityRange[0] !== 0 ||
    priorityRange[1] !== 100 ||
    searchQuery !== ""

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Feature Comparison Matrix</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Showing {filteredFeatures.length} of {features.length} features
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mt-4 lg:flex-row lg:items-end">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={parityFilter} onValueChange={setParityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Parity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-1.5 border border-border">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Priority:</span>
              <Slider
                value={priorityRange}
                onValueChange={setPriorityRange}
                min={0}
                max={100}
                step={5}
                className="w-28"
              />
              <span className="text-xs font-medium min-w-[50px]">
                {priorityRange[0]}-{priorityRange[1]}
              </span>
            </div>

            <Button variant="default" size="sm" onClick={handleApplyFilters} className="gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="max-h-[600px] overflow-auto">
            <TooltipProvider>
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wider min-w-[200px]">
                      Feature Name
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-center">
                      SEO Space
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-center">SEMrush</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-center">peec</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-center">Priority</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeatures.map((feature, index) => (
                    <TableRow
                      key={feature.id}
                      onClick={() => router.push(`/feature/${feature.id}`)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        index % 2 === 0 ? "bg-card" : "bg-muted/20",
                        "hover:bg-muted/50",
                      )}
                    >
                      <TableCell className="font-medium text-sm">{feature.name}</TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center justify-center">
                              {getImplementationIcon(feature.seoSpace)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{getTooltipContent(feature, "seoSpace")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center justify-center">
                              {getImplementationIcon(feature.semrush)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{getTooltipContent(feature, "semrush")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center justify-center">
                              {getImplementationIcon(feature.peec)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{getTooltipContent(feature, "peec")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-foreground text-background font-semibold text-xs">
                          {feature.priorityScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{feature.category}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
