import { useForm } from 'react-hook-form';
import { handleFormErrors } from '@/lib/formUtils';
import { CreateUserPayload } from '../types/user.types';
import { UserRole } from '@/features/auth/types/auth.types';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/shared/forms/FormInput';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import FormSelect from '@/components/shared/forms/FormSelect';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserPayload) => void;
  isLoading: boolean;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateUserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    defaultValues: { role: 'admin' },
  });

  const handleFormSubmit = (data: CreateUserPayload) => {
    onSubmit(data);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-lg font-bold">إضافة مستخدم جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pt-2 pe-1">
          <FormInput
            name="name"
            label="الاسم الكامل"
            placeholder="مثال: أحمد محمد"
            register={register}
            error={errors.name?.message}
            rules={{ required: 'الاسم مطلوب' }}
          />

          <FormInput
            name="email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="admin@example.com"
            register={register}
            error={errors.email?.message}
            rules={{ required: 'البريد الإلكتروني مطلوب' }}
          />

          <PasswordInput
            name="password"
            label="كلمة المرور الأولية"
            placeholder="أدخل كلمة المرور"
            register={register}
            error={errors.password?.message}
            rules={{
              required: 'كلمة المرور مطلوبة',
              minLength: { value: 8, message: 'يجب ألا تقل عن 8 خانات' },
            }}
          />

          <FormSelect
            label="الصلاحية (الدور)"
            value={watch('role') || 'admin'}
            onChange={(val) =>
              setValue('role', val as UserRole, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            options={[
              { value: 'super_admin', label: 'مدير عام (Super Admin)' },
              { value: 'admin', label: 'مشرف (Admin - قراءة وتعديل)' },
              { value: 'observer', label: 'مراقب (Observer - قراءة فقط)' },
            ]}
            error={errors.role?.message}
          />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText="جاري الإضافة..."
              className="rounded-xl px-6"
            >
              حفظ المستخدم
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateUserDialog;
