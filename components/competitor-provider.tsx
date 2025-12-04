"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useToast } from "@/components/ui/toast-banner"

type Competitor = "semrush" | "peec"

interface CompetitorContextValue {
  competitor: Competitor
  isSwitching: boolean
  setCompetitor: (competitor: Competitor) => void
}

const CompetitorContext = createContext<CompetitorContextValue | null>(null)

export function CompetitorProvider({ children }: { children: React.ReactNode }) {
  const [competitor, setCompetitorState] = useState<Competitor>("semrush")
  const [isSwitching, setIsSwitching] = useState(false)
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { showToast } = useToast()

  const setCompetitor = (next: Competitor) => {
    if (next === competitor) return

    setIsSwitching(true)
    if (switchTimer.current) {
      clearTimeout(switchTimer.current)
    }

    switchTimer.current = setTimeout(() => {
      setCompetitorState(next)
      setIsSwitching(false)
      showToast(`Switched to ${next === "semrush" ? "SEMrush" : "peec"} comparison`, "info")
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (switchTimer.current) {
        clearTimeout(switchTimer.current)
      }
    }
  }, [])

  const value = useMemo(
    () => ({ competitor, isSwitching, setCompetitor }),
    [competitor, isSwitching],
  )

  return <CompetitorContext.Provider value={value}>{children}</CompetitorContext.Provider>
}

export function useCompetitor() {
  const context = useContext(CompetitorContext)
  if (!context) {
    throw new Error("useCompetitor must be used within a CompetitorProvider")
  }
  return context
}
