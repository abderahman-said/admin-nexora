import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[70px] w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-all duration-150 outline-none placeholder:text-muted-foreground/75 hover:border-border/90 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 shadow-2xs resize-y",
          error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
