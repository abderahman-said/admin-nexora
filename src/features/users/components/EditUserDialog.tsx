import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AdminUser, UpdateUserPayload } from '../types/user.types';
import { getDirtyValues } from '@/lib/dirtyValues';
import { handleFormErrors } from '@/lib/formUtils';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/shared/forms/FormInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSubmit: (dirtyData: Partial<UpdateUserPayload>) => void;
  isLoading: boolean;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: EditUserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<UpdateUserPayload>({ mode: 'onChange' });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, open, reset]);

  const handleFormSubmit = (data: UpdateUserPayload) => {
    if (!user) return;
    const dirty = getDirtyValues(dirtyFields, data, {
      name: user.name || '',
      email: user.email || '',
    });
    if (Object.keys(dirty).length === 0) {
      toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
      return;
    }
    onSubmit(dirty);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-lg font-bold">
            تعديل بيانات {user?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-4 pt-2">
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

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={!isDirty || isLoading}
              loadingText="جاري التحديث..."
              className="rounded-xl px-6"
            >
              حفظ التعديلات
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;
