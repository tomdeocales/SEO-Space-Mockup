"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md mx-4 border border-border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Loading..." : confirmText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
