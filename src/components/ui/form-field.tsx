import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormFieldContextValue {
  name: string;
  error: string | null;
  touched: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({
  name: "",
  error: null,
  touched: false,
})

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  error?: string | null;
  touched?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(({ className, name, error, touched, children, ...props }, ref) => {
  return (
    <FormFieldContext.Provider value={{ name, error: error || null, touched: touched || false }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
})
FormField.displayName = "FormField"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => {
  const { name } = React.useContext(FormFieldContext)
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium inline-block leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      htmlFor={name}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

interface FormControlProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  options?: Array<{ value: string; label: string } | string>;
  ref?: React.Ref<HTMLInputElement>;
}

const FormControl = React.forwardRef<HTMLInputElement, FormControlProps>(({ type = "text", options, className, ...props }, ref) => {
  const { name, error, touched } = React.useContext(FormFieldContext)

  const inputClassName = cn(
    "w-full",
    error && touched && "border-destructive focus:border-destructive focus:ring-destructive",
    className
  )

  const selectContent = React.useMemo(() => {
    if (type === "select" && options) {
      return (
        <SelectContent>
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      )
    }
    return null
  }, [type, options])

  if (type === "select" && options) {
    const { onChange, onBlur, placeholder, disabled, required, name } = props
    return (
      <Select
        disabled={disabled}
        required={required}
        onValueChange={(value) => {
          onChange?.({ target: { value, name } } as React.ChangeEvent<HTMLInputElement>)
        }}
        onOpenChange={(open) => {
          if (!open && onBlur) onBlur({ target: { name, value: props.value || '' } } as React.FocusEvent<HTMLInputElement>)
        }}
      >
        <SelectTrigger type="button" className={inputClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {selectContent}
      </Select>
    )
  }

  if (type === "textarea") {
    return (
      <Textarea
        id={name}
        name={name}
        className={inputClassName}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
      />
    )
  }

  return (
    <Input
      id={name}
      name={name}
      type={type}
      className={inputClassName}
      ref={ref}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
  const { error } = React.useContext(FormFieldContext);
  if (!error) return null;

  return (
    <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {error}
    </p>
  );
});
FormMessage.displayName = "FormMessage"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

export {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
}
