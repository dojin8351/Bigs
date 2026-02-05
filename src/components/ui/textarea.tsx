import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input/50 placeholder:text-muted-foreground/60 focus-visible:border-ring/50 focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive/50 dark:bg-input/40 flex field-sizing-content min-h-16 w-full rounded-lg border bg-background/50 backdrop-blur-sm px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:bg-background hover:border-input disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
