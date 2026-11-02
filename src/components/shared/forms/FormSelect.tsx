import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  label?: string;
  labelExtra?: React.ReactNode;
  value?: string | number;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  name?: string;
  required?: boolean;
  dir?: 'rtl' | 'ltr';
}

export default function FormSelect({
  label,
  labelExtra,
  value,
  onChange,
  options,
  placeholder = 'اختر من القائمة...',
  error,
  disabled = false,
  className,
  triggerClassName,
  required = false,
  dir = 'rtl',
}: FormSelectProps) {
  // Normalize value to a string for comparison
  const normalizedValue = value !== undefined && value !== null ? String(value) : undefined;

  // Find currently selected option
  const selectedOption = React.useMemo(() => {
    if (normalizedValue === undefined) return undefined;
    return options.find((opt) => String(opt.value) === normalizedValue);
  }, [options, normalizedValue]);

  // Radix UI Select does not allow empty string "" as a value for SelectItem.
  // We map empty string "" to "__EMPTY__" internally.
  const internalValue = React.useMemo(() => {
    if (normalizedValue === undefined) return undefined;
    if (normalizedValue === '') {
      // If there is an explicit option for empty string, select "__EMPTY__"
      const hasEmptyOpt = options.some((opt) => String(opt.value) === '');
      return hasEmptyOpt ? '__EMPTY__' : undefined;
    }
    return normalizedValue;
  }, [normalizedValue, options]);

  const handleValueChange = (val: string) => {
    if (!onChange) return;
    const resolved = val === '__EMPTY__' ? '' : val;
    onChange(resolved);
  };

  return (
    <div className={cn('space-y-1.5 text-start', className)}>
      {label && (
        <div className="h-5 flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-danger">*</span>}
          </label>
          {labelExtra}
        </div>
      )}

      <Select
        value={internalValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        dir={dir}
      >
        <SelectTrigger
          className={cn(
            error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption ? selectedOption.label : undefined}
          </SelectValue>
        </SelectTrigger>

        <SelectContent align="start">
          {options.map((opt) => {
            const strVal = String(opt.value);
            const itemValue = strVal === '' ? '__EMPTY__' : strVal;
            return (
              <SelectItem
                key={itemValue}
                value={itemValue}
                disabled={opt.disabled}
                className="text-xs sm:text-sm"
              >
                {opt.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  );
}
