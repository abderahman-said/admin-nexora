import * as React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface FormInputProps extends Omit<InputProps, 'name' | 'error'> {
  label?: string;
  labelExtra?: React.ReactNode;
  name?: string;
  error?: string | null;
  helperText?: string;
  register?: any;
  rules?: any;
  touched?: boolean;
  required?: boolean;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      labelExtra,
      name,
      error,
      helperText,
      register,
      rules,
      touched,
      required = false,
      className,
      containerClassName,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const registerProps = register && name ? register(name, rules) : undefined;

    return (
      <div className={cn('space-y-1.5 text-start', containerClassName)}>
        {label && (
          <div className="h-5 flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-foreground flex items-center gap-1"
            >
              <span>{label}</span>
              {required && <span className="text-danger">*</span>}
            </label>
            {labelExtra}
          </div>
        )}

        <Input
          id={inputId}
          name={name}
          ref={ref}
          error={Boolean(error)}
          className={cn(className)}
          {...registerProps}
          {...(value !== undefined ? { value } : {})}
          {...(onChange ? { onChange } : {})}
          {...props}
        />

        {error && <p className="text-xs text-danger font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

export default FormInput;
