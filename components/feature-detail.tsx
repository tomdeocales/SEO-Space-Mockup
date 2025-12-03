"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { type Feature, getParityStatus } from "@/lib/data"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, ExternalLink, FileText, Zap, Target, Clock } from "lucide-react"
import { FormModal } from "@/components/ui/form-modal"
import { useToast } from "@/components/ui/toast-banner"

interface FeatureDetailProps {
  feature: Feature
  competitor: "semrush" | "peec"
}

export function FeatureDetail({ feature, competitor }: FeatureDetailProps) {
  const router = useRouter()
  const parityStatus = getParityStatus(feature, competitor)
  const { showToast } = useToast()

  const [showRoadmapModal, setShowRoadmapModal] = useState(false)
  const [selectedSprint, setSelectedSprint] = useState("")
  const [adding, setAdding] = useState(false)

  const [showReassignModal, setShowReassignModal] = useState(false)

  const getStatusBadge = () => {
    if (parityStatus === "full") {
      return (
        <Badge variant="outline" className="border-status-ahead/50 text-status-ahead bg-status-ahead/10">
          Ahead / On Par
        </Badge>
      )
    }
    if (parityStatus === "partial") {
      return (
        <Badge variant="outline" className="border-status-partial/50 text-status-partial bg-status-partial/10">
          Partial
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-status-behind/50 text-status-behind bg-status-behind/10">
        Missing
      </Badge>
    )
  }

  const getPriorityBadge = () => {
    return (
      <Badge variant="secondary" className="font-medium">
        Priority: {feature.priorityScore}
      </Badge>
    )
  }

  const handleAddToRoadmap = () => {
    if (feature.sprint) {
      // Feature already in roadmap, show reassign modal
      setShowReassignModal(true)
    } else {
      // New addition, show add modal
      setShowRoadmapModal(true)
    }
  }

  const handleConfirmAddToRoadmap = () => {
    if (!selectedSprint) {
      showToast("Please select a sprint", "error")
      return
    }
    setAdding(true)
    setTimeout(() => {
      setAdding(false)
      setShowRoadmapModal(false)
      showToast(`${feature.name} added to Sprint ${selectedSprint}`, "success")
      router.push(`/roadmap?highlight=${feature.id}`)
    }, 800)
  }

  const handleConfirmReassign = () => {
    if (!selectedSprint) {
      showToast("Please select a sprint", "error")
      return
    }
    setAdding(true)
    setTimeout(() => {
      setAdding(false)
      setShowReassignModal(false)
      showToast(`${feature.name} moved to Sprint ${selectedSprint}`, "success")
      router.push(`/roadmap?highlight=${feature.id}`)
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{feature.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline">{feature.category}</Badge>
            {getPriorityBadge()}
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN - Competitor Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            Competitor Implementations
          </h2>

          {/* SEMrush Card */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-foreground text-background text-xs font-bold">
                    S
                  </span>
                  SEMrush
                </span>
                <Badge
                  variant={feature.semrush === 2 ? "outline" : feature.semrush === 1 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {feature.semrush === 2 ? "Full" : feature.semrush === 1 ? "Partial" : "Missing"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.semrushDescription}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Inputs</h4>
                  <ul className="space-y-1">
                    {feature.inputs.map((input, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-foreground" />
                        {input}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Outputs</h4>
                  <ul className="space-y-1">
                    {feature.outputs.map((output, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-foreground" />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Job To Be Done
                </h4>
                <p className="text-sm bg-muted/50 rounded-lg p-3 italic">{feature.jtbd}</p>
              </div>

              <div className="border border-dashed border-border rounded-lg p-6 flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground">Competitor UI Sample</span>
              </div>
            </CardContent>
          </Card>

          {/* peec Card */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-muted text-foreground text-xs font-bold">
                    P
                  </span>
                  peec
                </span>
                <Badge
                  variant={feature.peec === 2 ? "outline" : feature.peec === 1 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {feature.peec === 2 ? "Full" : feature.peec === 1 ? "Partial" : "Missing"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.peecDescription}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Inputs</h4>
                  <ul className="space-y-1">
                    {feature.inputs.map((input, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-foreground" />
                        {input}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Outputs</h4>
                  <ul className="space-y-1">
                    {feature.outputs.map((output, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-foreground" />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border border-dashed border-border rounded-lg p-6 flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground">Competitor UI Sample</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - SEO Space Plan */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            SEO Space Plan
          </h2>

          {/* Current State */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Our Current State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    feature.seoSpace === 2
                      ? "border-status-ahead/50 text-status-ahead bg-status-ahead/10"
                      : feature.seoSpace === 1
                        ? "border-status-partial/50 text-status-partial bg-status-partial/10"
                        : "border-status-behind/50 text-status-behind bg-status-behind/10",
                  )}
                >
                  {feature.seoSpace === 2 ? "Present" : feature.seoSpace === 1 ? "Partial" : "Missing"}
                </Badge>
                <span className="text-sm text-muted-foreground">{feature.description}</span>
              </div>
            </CardContent>
          </Card>

          {/* Our Plan */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                Our Plan (v1)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Inputs</h4>
                <ul className="space-y-1">
                  {feature.inputs.map((input, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-foreground" />
                      {input}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Outputs</h4>
                <ul className="space-y-1">
                  {feature.outputs.map((output, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-foreground" />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Minimal UX</h4>
                <p className="text-sm bg-muted/50 rounded-lg p-3">
                  User enters {feature.inputs[0]?.toLowerCase()} → We display{" "}
                  {feature.outputs.slice(0, 2).join(", ").toLowerCase()} with actionable insights and export options.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Effort & Timing */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Effort & Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Effort</span>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                      {feature.effort === "S" ? "Small" : feature.effort === "M" ? "Medium" : "Large"}
                    </Badge>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Target Sprint
                  </span>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {feature.sprint ? `Sprint ${feature.sprint}` : "TBD"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA - Updated to show modal */}
          <Button size="lg" className="w-full" onClick={handleAddToRoadmap}>
            <Plus className="h-4 w-4 mr-2" />
            {feature.sprint ? "Reassign Sprint" : "Add to Roadmap"}
          </Button>
        </div>
      </div>

      <FormModal
        open={showRoadmapModal}
        onClose={() => setShowRoadmapModal(false)}
        title="Add to Roadmap"
        onSubmit={handleConfirmAddToRoadmap}
        submitText="Add to Roadmap"
        loading={adding}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add <strong>{feature.name}</strong> to the product roadmap.
          </p>
          <div className="space-y-2">
            <Label>Target Sprint</Label>
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger>
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sprint 1</SelectItem>
                <SelectItem value="2">Sprint 2</SelectItem>
                <SelectItem value="3">Sprint 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Effort</span>
              <span className="font-medium">
                {feature.effort === "S" ? "Small" : feature.effort === "M" ? "Medium" : "Large"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Priority</span>
              <span className="font-medium">{feature.priorityScore}</span>
            </div>
          </div>
        </div>
      </FormModal>

      <FormModal
        open={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Reassign Sprint"
        onSubmit={handleConfirmReassign}
        submitText="Reassign"
        loading={adding}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <strong>{feature.name}</strong> is currently in <strong>Sprint {feature.sprint}</strong>. Select a new
            sprint to reassign.
          </p>
          <div className="space-y-2">
            <Label>New Sprint</Label>
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger>
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sprint 1</SelectItem>
                <SelectItem value="2">Sprint 2</SelectItem>
                <SelectItem value="3">Sprint 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
