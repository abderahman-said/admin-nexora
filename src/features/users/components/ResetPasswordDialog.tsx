import { useForm } from 'react-hook-form';
import { handleFormErrors } from '@/lib/formUtils';
import { AdminUser } from '../types/user.types';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSubmit: (data: { password: string }) => void;
  isLoading: boolean;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: ResetPasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ password: string }>();

  const handleFormSubmit = (data: { password: string }) => {
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
          <DialogTitle className="text-lg font-bold">
            إعادة تعيين كلمة المرور لـ {user?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-4 pt-2">
          <PasswordInput
            name="password"
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            register={register}
            error={errors.password?.message}
            rules={{
              required: 'كلمة المرور مطلوبة',
              minLength: { value: 8, message: 'يجب ألا تقل عن 8 خانات' },
            }}
          />

          <div className="flex items-center justify-end gap-2 pt-4">
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
              loadingText="جاري التعيين..."
              className="rounded-xl px-6"
            >
              تعيين كلمة المرور
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ResetPasswordDialog;
