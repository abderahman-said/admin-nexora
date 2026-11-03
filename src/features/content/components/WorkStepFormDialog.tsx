import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { WorkStep, WorkStepFormData } from '../types/content.types';
import { getDirtyValues } from '@/lib/dirtyValues';
import { getMediaUrl } from '@/lib/utils';
import { handleFormErrors } from '@/lib/formUtils';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WorkStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStep: WorkStep | null;
  totalCount: number;
  onCreate: (data: WorkStepFormData, file: File | null) => void;
  onUpdate: (id: number, dirty: Partial<WorkStepFormData>, file: File | null) => void;
  isLoading: boolean;
}

export function WorkStepFormDialog({
  open,
  onOpenChange,
  editingStep,
  totalCount,
  onCreate,
  onUpdate,
  isLoading,
}: WorkStepFormDialogProps) {
  const [iconFile, setIconFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<WorkStepFormData>({
    mode: 'onChange',
    defaultValues: {
      step_number: 1,
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      is_active: true,
    },
  });

  useEffect(() => {
    if (editingStep && open) {
      reset({
        step_number: editingStep.step_number || 1,
        title: {
          ar: editingStep.title?.ar || '',
          en: editingStep.title?.en || '',
        },
        description: {
          ar: editingStep.description?.ar || '',
          en: editingStep.description?.en || '',
        },
        is_active: editingStep.is_active ?? true,
      });
      setIconFile(null);
    } else if (open) {
      reset({
        step_number: totalCount + 1,
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        is_active: true,
      });
      setIconFile(null);
    }
  }, [editingStep, open, totalCount, reset]);

  const handleFormSubmit = (data: WorkStepFormData) => {
    if (editingStep) {
      const original: WorkStepFormData = {
        step_number: editingStep.step_number || 1,
        title: {
          ar: editingStep.title?.ar || '',
          en: editingStep.title?.en || '',
        },
        description: {
          ar: editingStep.description?.ar || '',
          en: editingStep.description?.en || '',
        },
        is_active: editingStep.is_active ?? true,
      };
      const dirty = getDirtyValues(dirtyFields, data, original);
      if (Object.keys(dirty).length === 0 && !iconFile) {
        toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
        return;
      }
      onUpdate(editingStep.id, dirty, iconFile);
    } else {
      onCreate(data, iconFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-lg font-bold">
            {editingStep ? 'تعديل خطوة العمل' : 'إضافة خطوة جديدة'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pt-2 pe-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              رقم الخطوة / الترتيب
            </label>
            <Input
              type="number"
              min="1"
              {...register('step_number', { valueAsNumber: true })}
            />
          </div>

          <TranslatableInput
            label="عنوان الخطوة"
            nameAr="title.ar"
            nameEn="title.en"
            register={register}
            errorAr={errors.title?.ar?.message}
            errorEn={errors.title?.en?.message}
            required
          />

          <TranslatableInput
            label="شرح وتفاصيل الخطوة"
            nameAr="description.ar"
            nameEn="description.en"
            register={register}
            errorAr={errors.description?.ar?.message}
            errorEn={errors.description?.en?.message}
            isTextarea
            rows={3}
            required
          />

          <ImageUploadPreview
            label="أيقونة أو صورة توضيحية للخطوة"
            currentImageUrl={getMediaUrl((editingStep as any)?.icon)}
            onChange={setIconFile}
            aspectRatio="square"
          />

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span>تفعيل الخطوة (نشطة)</span>
            </label>
          </div>

          </div>
          <DialogFooter>
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
              loadingText="جاري الحفظ..."
              disabled={
                Boolean(editingStep && !isDirty && !iconFile) || isLoading
              }
              className="rounded-xl px-6"
            >
              {editingStep ? 'حفظ التعديلات' : 'إضافة الخطوة'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WorkStepFormDialog;
