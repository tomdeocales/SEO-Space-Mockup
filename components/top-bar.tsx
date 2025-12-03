"use client"

import { Settings, Moon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Moon className="h-4 w-4" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
