import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form-field';

interface PasswordInputProps {
  label?: string;
  name: string;
  error?: string;
  register?: any;
  rules?: any;
  touched?: boolean;
  className?: string;
  placeholder?: string;
}

export function PasswordInput({
  label,
  name,
  error,
  register,
  rules,
  touched,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField name={name} error={error} touched={touched}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="relative">
        <FormControl
          type={showPassword ? 'text' : 'password'}
          className={`${className} pe-11`}
          {...(register ? register(name, rules) : {})}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/75 hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <FormMessage />
    </FormField>
  );
}
