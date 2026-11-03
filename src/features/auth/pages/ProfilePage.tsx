import { useForm } from 'react-hook-form';
import { Shield, KeyRound, Mail, Calendar } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useChangePassword, useProfile } from '../hooks/useAuthMutations';
import { ChangePasswordPayload } from '../types/auth.types';
import PageHeader from '@/components/shared/PageHeader';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import StatusBadge from '@/components/shared/StatusBadge';

export default function ProfilePage() {
  const storeUser = useAuthStore((s) => s.user);
  const { data: profileResponse, isLoading: profileLoading } = useProfile();
  const { mutate: changePassword, isPending: passwordChanging } = useChangePassword();

  const user = profileResponse?.data || storeUser;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordPayload>({ mode: 'onTouched' });

  const newPassword = watch('new_password');

  const onSubmitPassword = (data: ChangePasswordPayload) => {
    changePassword(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  if (profileLoading && !user) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل الملف الشخصي...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="الملف الشخصي"
        description="بيانات الحساب للعرض فقط، مع إمكانية تغيير كلمة المرور."
      />

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mb-4 border border-primary/20">
            {user?.name?.slice(0, 2)?.toUpperCase() || 'AD'}
          </div>
          <h2 className="text-xl font-bold text-foreground">{user?.name || 'مدير النظام'}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
          <div className="mt-3">
            <StatusBadge status={user?.role || 'admin'} type="role" />
          </div>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> الحالة:
            </span>
            <span className="font-medium text-emerald-600">نشط</span>
          </div>
          {user?.last_login_at && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> آخر دخول:
              </span>
              <span className="font-medium">{new Date(user.last_login_at).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">تغيير كلمة المرور</h3>
            <p className="text-xs text-muted-foreground">تأكد من اختيار كلمة مرور قوية وغير مكررة</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4 max-w-lg">
          <PasswordInput
            name="current_password"
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            register={register}
            error={errors.current_password?.message}
            rules={{ required: 'كلمة المرور الحالية مطلوبة' }}
          />

          <PasswordInput
            name="new_password"
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            register={register}
            error={errors.new_password?.message}
            rules={{
              required: 'كلمة المرور الجديدة مطلوبة',
              minLength: { value: 8, message: 'يجب ألا تقل عن 8 خانات' },
            }}
          />

          <PasswordInput
            name="new_password_confirmation"
            label="تأكيد كلمة المرور الجديدة"
            placeholder="أعد إدخال كلمة المرور الجديدة"
            register={register}
            error={errors.new_password_confirmation?.message}
            rules={{
              required: 'تأكيد كلمة المرور مطلوب',
              validate: (val: string) => val === newPassword || 'كلمتا المرور غير متطابقتين',
            }}
          />

          <LoadingButton
            type="submit"
            loading={passwordChanging}
            loadingText="جاري الحفظ..."
            className="mt-2 w-full sm:w-auto px-6 h-11"
          >
            تحديث كلمة المرور
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
