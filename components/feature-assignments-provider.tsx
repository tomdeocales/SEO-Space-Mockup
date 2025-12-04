"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { features as baseFeatures, type Feature } from "@/lib/data"

type FeatureStatus = "not_started" | "in_progress" | "completed"

export type FeatureWithState = Feature & { status: FeatureStatus }

interface FeatureAssignmentsContextValue {
  features: FeatureWithState[]
  assignSprint: (featureId: string, sprint: number) => void
  clearSprint: (featureId: string) => void
  setStatus: (featureId: string, status: FeatureStatus) => void
  getFeatureById: (featureId: string) => FeatureWithState | undefined
}

const FeatureAssignmentsContext = createContext<FeatureAssignmentsContextValue | null>(null)

export function FeatureAssignmentsProvider({ children }: { children: React.ReactNode }) {
  const initialAssignments = useMemo(() => {
    const preset: Record<string, number | undefined> = {}
    baseFeatures.forEach((f) => {
      if (f.sprint) preset[f.id] = f.sprint
    })
    return preset
  }, [])

  const initialStatuses = useMemo(() => {
    const preset: Record<string, FeatureStatus> = {}
    baseFeatures.forEach((f) => {
      if (f.roadmapStatus === "shipped") {
        preset[f.id] = "completed"
      } else if (f.roadmapStatus === "in_progress") {
        preset[f.id] = "in_progress"
      } else {
        preset[f.id] = "not_started"
      }
    })
    return preset
  }, [])

  const [assignments, setAssignments] = useState<Record<string, number | undefined>>(initialAssignments)
  const [statuses, setStatuses] = useState<Record<string, FeatureStatus>>(initialStatuses)

  const features: FeatureWithState[] = useMemo(
    () =>
      baseFeatures.map((feature) => ({
        ...feature,
        sprint: assignments[feature.id] ?? feature.sprint,
        status: statuses[feature.id] ?? "not_started",
      })),
    [assignments, statuses],
  )

  const assignSprint = (featureId: string, sprint: number) => {
    setAssignments((prev) => ({ ...prev, [featureId]: sprint }))
  }

  const clearSprint = (featureId: string) => {
    setAssignments((prev) => {
      const next = { ...prev }
      delete next[featureId]
      return next
    })
  }

  const setStatus = (featureId: string, status: FeatureStatus) => {
    setStatuses((prev) => ({ ...prev, [featureId]: status }))
  }

  const getFeatureById = (featureId: string) => features.find((f) => f.id === featureId)

  const value: FeatureAssignmentsContextValue = {
    features,
    assignSprint,
    clearSprint,
    setStatus,
    getFeatureById,
  }

  return <FeatureAssignmentsContext.Provider value={value}>{children}</FeatureAssignmentsContext.Provider>
}

export function useFeatureAssignments() {
  const ctx = useContext(FeatureAssignmentsContext)
  if (!ctx) throw new Error("useFeatureAssignments must be used within FeatureAssignmentsProvider")
  return ctx
}
