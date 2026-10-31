import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form-field';

interface FormInputProps {
  label?: string;
  name: string;
  error?: string;
  register?: any;
  rules?: any;
  touched?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

export function FormInput({
  label,
  name,
  error,
  register,
  rules,
  touched,
  className,
  value,
  onChange,
  ...props
}: FormInputProps) {
  // Support react-hook-form (register) AND keep `value` for controlled
  // inputs like Select, where the trigger needs an explicit value to
  // render the current/default selection.
  const controlProps = register
    ? (value !== undefined ? { ...register(name, rules), value } : register(name, rules))
    : (value !== undefined ? { value, onChange } : { onChange });

  return (
    <FormField name={name} error={error} touched={touched}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl
        {...controlProps}
        className={className}
        {...props}
      />
      <FormMessage />
    </FormField>
  );
}

export default FormInput;
