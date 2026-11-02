import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Testimonial, TestimonialFormData } from '../types/content.types';
import { getDirtyValues } from '@/lib/dirtyValues';
import { getMediaUrl } from '@/lib/utils';
import { handleFormErrors } from '@/lib/formUtils';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import FormSelect from '@/components/shared/forms/FormSelect';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: Testimonial | null;
  totalCount: number;
  onCreate: (data: TestimonialFormData, file: File | null) => void;
  onUpdate: (id: number, dirty: Partial<TestimonialFormData>, file: File | null) => void;
  isLoading: boolean;
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  editingItem,
  totalCount,
  onCreate,
  onUpdate,
  isLoading,
}: TestimonialFormDialogProps) {
  const [clientImageFile, setClientImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<TestimonialFormData>({
    mode: 'onChange',
    defaultValues: {
      client_name: { ar: '', en: '' },
      client_job: { ar: '', en: '' },
      comment: { ar: '', en: '' },
      rating: 5,
      is_active: true,
      sort_order: 1,
    },
  });

  useEffect(() => {
    if (editingItem && open) {
      reset({
        client_name: {
          ar: editingItem.client_name?.ar || '',
          en: editingItem.client_name?.en || '',
        },
        client_job: {
          ar: editingItem.client_job?.ar || '',
          en: editingItem.client_job?.en || '',
        },
        comment: {
          ar: editingItem.comment?.ar || '',
          en: editingItem.comment?.en || '',
        },
        rating: editingItem.rating || 5,
        is_active: editingItem.is_active ?? true,
        sort_order: (editingItem as any).sort_order ?? 1,
      });
      setClientImageFile(null);
    } else if (open) {
      reset({
        client_name: { ar: '', en: '' },
        client_job: { ar: '', en: '' },
        comment: { ar: '', en: '' },
        rating: 5,
        is_active: true,
        sort_order: totalCount + 1,
      });
      setClientImageFile(null);
    }
  }, [editingItem, open, totalCount, reset]);

  const handleFormSubmit = (data: TestimonialFormData) => {
    if (editingItem) {
      const original: TestimonialFormData = {
        client_name: {
          ar: editingItem.client_name?.ar || '',
          en: editingItem.client_name?.en || '',
        },
        client_job: {
          ar: editingItem.client_job?.ar || '',
          en: editingItem.client_job?.en || '',
        },
        comment: {
          ar: editingItem.comment?.ar || '',
          en: editingItem.comment?.en || '',
        },
        rating: editingItem.rating || 5,
        is_active: editingItem.is_active ?? true,
        sort_order: (editingItem as any).sort_order ?? 1,
      };
      const dirty = getDirtyValues(dirtyFields, data, original);
      if (Object.keys(dirty).length === 0 && !clientImageFile) {
        toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
        return;
      }
      onUpdate(editingItem.id, dirty, clientImageFile);
    } else {
      onCreate(data, clientImageFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-lg font-bold">
            {editingItem ? 'تعديل تقييم العميل' : 'إضافة تقييم جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-4 pt-2">
          <TranslatableInput
            label="اسم العميل"
            nameAr="client_name.ar"
            nameEn="client_name.en"
            register={register}
            errorAr={errors.client_name?.ar?.message}
            errorEn={errors.client_name?.en?.message}
            required
          />

          <TranslatableInput
            label="الوظيفة / الشركة"
            nameAr="client_job.ar"
            nameEn="client_job.en"
            register={register}
            placeholderAr="مثال: مدير تنفيذي في شركة..."
            placeholderEn="e.g. CEO at..."
          />

          <TranslatableInput
            label="نص الرأي / التوصية"
            nameAr="comment.ar"
            nameEn="comment.en"
            register={register}
            errorAr={errors.comment?.ar?.message}
            errorEn={errors.comment?.en?.message}
            isTextarea
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <FormSelect
              label="التقييم (النجوم)"
              value={String(watch('rating') || 5)}
              onChange={(val) =>
                setValue('rating', Number(val), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              options={[
                { value: '5', label: '⭐⭐⭐⭐⭐ (5 نجوم - ممتاز)' },
                { value: '4', label: '⭐⭐⭐⭐ (4 نجوم - جيد جداً)' },
                { value: '3', label: '⭐⭐⭐ (3 نجوم - جيد)' },
              ]}
            />

            <div className="space-y-1.5">
              <div className="h-5 flex items-center">
                <label className="text-xs font-semibold text-foreground">الترتيب</label>
              </div>
              <Input
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span>تفعيل التقييم (نشط ومعروض)</span>
            </label>
          </div>

          <ImageUploadPreview
            label="صورة العميل (اختياري)"
            currentImageUrl={getMediaUrl((editingItem as any)?.client_image)}
            onChange={setClientImageFile}
            aspectRatio="square"
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
              loadingText="جاري الحفظ..."
              disabled={
                Boolean(editingItem && !isDirty && !clientImageFile) || isLoading
              }
              className="rounded-xl px-6"
            >
              {editingItem ? 'حفظ التعديلات' : 'حفظ التقييم'}
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TestimonialFormDialog;
