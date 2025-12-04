"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface FormModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void
  submitText?: string
  loading?: boolean
  submitDisabled?: boolean
}

export function FormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Submit",
  loading = false,
  submitDisabled = false,
}: FormModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-lg mx-4 border border-border shadow-lg">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {onSubmit && (
          <CardFooter className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading || submitDisabled}>
              {loading ? "Submitting..." : submitText}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
