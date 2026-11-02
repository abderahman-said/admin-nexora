import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/shared/forms/FormInput';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { LoginCredentials } from '@/features/auth/types/auth.types';

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => void;
  loading: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start" noValidate>
      <FormInput
        name="email"
        label="البريد الإلكتروني"
        type="email"
        placeholder="admin@nexora.com"
        className="h-10.5 rounded-xl text-xs"
        error={errors.email?.message}
        register={register}
        rules={{
          required: 'البريد الإلكتروني مطلوب',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'البريد الإلكتروني غير صالح',
          },
        }}
      />

      <PasswordInput
        name="password"
        label="كلمة المرور"
        placeholder="••••••••"
        className="h-10.5 rounded-xl text-xs"
        error={errors.password?.message}
        register={register}
        rules={{
          required: 'كلمة المرور مطلوبة',
          minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        }}
      />

      <div className="pt-2">
        <LoadingButton
          type="submit"
          className="w-full h-10.5 rounded-xl font-semibold text-xs shadow-xs"
          loading={loading}
          loadingText="جاري تسجيل الدخول..."
        >
          تسجيل الدخول إلى النظام
        </LoadingButton>
      </div>

      <p className="text-[11px] text-muted-foreground text-center pt-3">
        منصة الإدارة الآمنة — Nexora Dashboard
      </p>
    </form>
  );
}
