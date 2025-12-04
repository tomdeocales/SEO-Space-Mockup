"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, User, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

interface TopBarProps {
  title: string
  onMenuClick?: () => void
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const notifications = useMemo(
    () => [
      {
        title: "Parity report ready",
        description: "Your weekly parity report is ready to review.",
        time: "5m ago",
        type: "success",
        unread: true
      },
      {
        title: "New gap identified",
        description: "Keyword Gap: Long-tail insights missing vs SEMrush.",
        time: "1h ago",
        type: "warning",
        unread: true
      },
      {
        title: "Roadmap update",
        description: "Local SEO rollout moved to in progress.",
        time: "Yesterday",
        type: "info",
        unread: false
      },
    ],
    [],
  )

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✓"
      case "warning":
        return "⚠"
      case "info":
        return "ℹ"
      default:
        return "•"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "warning":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      case "info":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Mobile Only */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-base lg:text-lg font-semibold text-foreground line-clamp-2">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] sm:w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <DropdownMenuLabel className="p-0 font-semibold">Notifications</DropdownMenuLabel>
              <button className="text-xs text-primary hover:underline font-medium">
                Mark all as read
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex gap-3 items-start px-4 py-3 cursor-pointer hover:bg-muted/50 border-b border-border last:border-0 focus:bg-muted/50"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getNotificationColor(item.type)}`}>
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground leading-tight">
                        {item.title}
                      </span>
                      {item.unread && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {item.time}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border bg-muted/30">
              <button className="w-full text-sm font-medium text-primary hover:underline text-center">
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
              <User className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                router.push("/settings")
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                handleLogout()
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
