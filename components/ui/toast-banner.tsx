"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastBannerProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
}

export function ToastBanner({ message, type = "success", duration = 3000, onClose }: ToastBannerProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm",
        type === "success" && "bg-card border-status-ahead/30 text-foreground",
        type === "error" && "bg-card border-status-behind/30 text-foreground",
        type === "info" && "bg-card border-border text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          type === "success" && "text-status-ahead",
          type === "error" && "text-status-behind",
          type === "info" && "text-muted-foreground",
        )}
      />
      <p className="text-sm">{message}</p>
      <button
        onClick={() => {
          setVisible(false)
          onClose?.()
        }}
        className="ml-auto shrink-0 p-1 hover:bg-muted rounded"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Toast context for global toast management
import { createContext, useContext, useCallback } from "react"

type Toast = {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: "success" | "error" | "info") => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Return a no-op version if context is not available
    return {
      toasts: [],
      showToast: () => {},
      removeToast: () => {},
    }
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastBanner key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
