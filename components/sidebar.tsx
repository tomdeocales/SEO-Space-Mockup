"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Grid3X3, Calendar, Search, Mail, Settings, HelpCircle, Command, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/components/auth-provider"

const dashboardItems = [
  { href: "/", label: "Parity Overview", icon: LayoutDashboard },
  { href: "/feature-map", label: "Feature Map", icon: Grid3X3 },
  { href: "/roadmap", label: "Roadmap", icon: Calendar },
]

const pageItems = [
  { href: "/reports", label: "Reports", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
]

interface SidebarProps {
  competitor: "semrush" | "peec"
  onCompetitorChange: (competitor: "semrush" | "peec") => void
  isLoading?: boolean
  disableCompetitorToggle?: boolean
}

export function Sidebar({ competitor, onCompetitorChange, isLoading = false, disableCompetitorToggle = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleCompetitorChange = (newCompetitor: "semrush" | "peec") => {
    if (disableCompetitorToggle) return
    if (newCompetitor !== competitor) {
      onCompetitorChange(newCompetitor)
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Command className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold text-sidebar-foreground">SEO Space</span>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground font-normal h-9 bg-transparent"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>J
          </kbd>
        </Button>
      </div>

      {/* Competitor Selector */}
      <div className="px-4 pb-3">
        <div className="flex rounded-lg border border-border p-1 bg-muted/50 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg z-10">
              <Spinner className="h-4 w-4" />
            </div>
          )}
          <button
            onClick={() => handleCompetitorChange("semrush")}
            disabled={isLoading || disableCompetitorToggle}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-70",
              competitor === "semrush"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            vs SEMrush
          </button>
          <button
            onClick={() => handleCompetitorChange("peec")}
            disabled={isLoading || disableCompetitorToggle}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-70",
              competitor === "peec"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            vs peec
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-4">
          <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Dashboards</span>
          <div className="mt-2 space-y-1">
            {dashboardItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Pages</span>
          <div className="mt-2 space-y-1">
            {pageItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">PM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Product Manager</p>
            <p className="text-xs text-muted-foreground truncate">pm@seospace.io</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => {
              logout()
              router.replace("/login")
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
