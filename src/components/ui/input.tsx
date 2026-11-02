import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-all duration-150 outline-none placeholder:text-muted-foreground/75 hover:border-border/90 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 shadow-2xs",
          error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    );
  }
)
Input.displayName = "Input"

export { Input }
