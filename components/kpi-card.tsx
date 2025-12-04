"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  trendDescription?: string
  variant?: "default" | "success" | "warning" | "danger" | "hero"
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  trendDescription,
  variant = "default",
}: KPICardProps) {
  const isHero = variant === "hero"

  return (
    <Card
      className={cn(
        "bg-card border border-border transition-all",
        isHero && "bg-primary text-primary-foreground border-primary",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <span className={cn("text-sm font-medium", isHero ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {title}
          </span>
          {trend && trendValue && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                isHero
                  ? "bg-white/20 text-white"
                  : trend === "up"
                    ? "bg-status-ahead/10 text-status-ahead"
                    : trend === "down"
                      ? "bg-status-behind/10 text-status-behind"
                      : "bg-muted text-muted-foreground",
              )}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className={cn("text-3xl font-bold tracking-tight", isHero ? "text-primary-foreground" : "text-foreground")}>
            {value}
          </span>
          {subtitle && (
            <span className={cn("text-base", isHero ? "text-primary-foreground/80" : "text-muted-foreground")}>
              {subtitle}
            </span>
          )}
        </div>
        {trendDescription && (
          <p className={cn("mt-1 text-sm", isHero ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {trendDescription}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
