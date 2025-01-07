import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <>
        <textarea
        className={cn(
            "focus-visible:outline-none focus-visible:border-[var(--app-color)] focus-visible:ring-[var(--app-color)] flex min-h-[80px] h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground  focus-visible:ring-0 focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
        )}
        ref={ref}
        {...props}
        />
    </>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
