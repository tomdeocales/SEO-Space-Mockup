"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { features as baseFeatures, type Feature } from "@/lib/data"

interface FeatureAssignmentsContextValue {
  features: Feature[]
  assignSprint: (featureId: string, sprint: number) => void
  getFeatureById: (featureId: string) => Feature | undefined
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

  const [assignments, setAssignments] = useState<Record<string, number | undefined>>(initialAssignments)

  const features = useMemo(
    () => baseFeatures.map((feature) => ({ ...feature, sprint: assignments[feature.id] ?? feature.sprint })),
    [assignments],
  )

  const assignSprint = (featureId: string, sprint: number) => {
    setAssignments((prev) => ({ ...prev, [featureId]: sprint }))
  }

  const getFeatureById = (featureId: string) => features.find((f) => f.id === featureId)

  const value: FeatureAssignmentsContextValue = {
    features,
    assignSprint,
    getFeatureById,
  }

  return <FeatureAssignmentsContext.Provider value={value}>{children}</FeatureAssignmentsContext.Provider>
}

export function useFeatureAssignments() {
  const ctx = useContext(FeatureAssignmentsContext)
  if (!ctx) throw new Error("useFeatureAssignments must be used within FeatureAssignmentsProvider")
  return ctx
}
