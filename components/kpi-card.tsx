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
  variant?: "default" | "success" | "warning" | "danger"
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
  return (
    <Card className="bg-card border border-border hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          {trend && trendValue && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend === "up" && "text-status-ahead",
                trend === "down" && "text-status-behind",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
          {subtitle && <span className="text-base text-muted-foreground">{subtitle}</span>}
        </div>
        {trendDescription && <p className="mt-1 text-sm text-muted-foreground">{trendDescription}</p>}
      </CardContent>
    </Card>
  )
}
