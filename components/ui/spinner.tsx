import type React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <Spinner />
    </div>
  )
}

export { Spinner, PageLoader, InlineLoader }
