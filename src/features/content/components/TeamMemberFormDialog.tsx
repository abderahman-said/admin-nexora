import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TeamMember, TeamMemberFormData } from '../types/content.types';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TeamMemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember: TeamMember | null;
  totalCount: number;
  onCreate: (data: TeamMemberFormData, file: File | null) => void;
  onUpdate: (id: number, dirty: Partial<TeamMemberFormData>, file: File | null) => void;
  isLoading: boolean;
}

export function TeamMemberFormDialog({
  open,
  onOpenChange,
  editingMember,
  totalCount,
  onCreate,
  onUpdate,
  isLoading,
}: TeamMemberFormDialogProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<TeamMemberFormData>({
    mode: 'onChange',
    defaultValues: {
      name: { ar: '', en: '' },
      job_title: { ar: '', en: '' },
      badge_text: { ar: '', en: '' },
      is_active: true,
      is_highlighted: false,
      sort_order: 1,
    },
  });

  useEffect(() => {
    if (editingMember && open) {
      reset({
        name: {
          ar: editingMember.name?.ar || '',
          en: editingMember.name?.en || '',
        },
        job_title: {
          ar: editingMember.job_title?.ar || '',
          en: editingMember.job_title?.en || '',
        },
        badge_text: {
          ar: editingMember.badge_text?.ar || '',
          en: editingMember.badge_text?.en || '',
        },
        is_active: editingMember.is_active ?? true,
        is_highlighted: (editingMember as any).is_highlighted ?? false,
        sort_order: editingMember.sort_order ?? 1,
      });
      setPhotoFile(null);
    } else if (open) {
      reset({
        name: { ar: '', en: '' },
        job_title: { ar: '', en: '' },
        badge_text: { ar: '', en: '' },
        is_active: true,
        is_highlighted: false,
        sort_order: totalCount + 1,
      });
      setPhotoFile(null);
    }
  }, [editingMember, open, totalCount, reset]);

  const handleFormSubmit = (data: TeamMemberFormData) => {
    if (editingMember) {
      const original: TeamMemberFormData = {
        name: {
          ar: editingMember.name?.ar || '',
          en: editingMember.name?.en || '',
        },
        job_title: {
          ar: editingMember.job_title?.ar || '',
          en: editingMember.job_title?.en || '',
        },
        badge_text: {
          ar: editingMember.badge_text?.ar || '',
          en: editingMember.badge_text?.en || '',
        },
        is_active: editingMember.is_active ?? true,
        is_highlighted: (editingMember as any).is_highlighted ?? false,
        sort_order: editingMember.sort_order ?? 1,
      };
      const dirty = getDirtyValues(dirtyFields, data, original);
      if (Object.keys(dirty).length === 0 && !photoFile) {
        toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
        return;
      }
      onUpdate(editingMember.id, dirty, photoFile);
    } else {
      onCreate(data, photoFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-lg font-bold">
            {editingMember ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للفريق'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-4 pt-2">
          <TranslatableInput
            label="اسم العضو"
            nameAr="name.ar"
            nameEn="name.en"
            register={register}
            errorAr={errors.name?.ar?.message}
            errorEn={errors.name?.en?.message}
            required
          />

          <TranslatableInput
            label="المسمى الوظيفي"
            nameAr="job_title.ar"
            nameEn="job_title.en"
            register={register}
            errorAr={errors.job_title?.ar?.message}
            errorEn={errors.job_title?.en?.message}
            placeholderAr="مثال: مهندس برمجيات أول"
            placeholderEn="e.g. Senior Software Engineer"
            required
          />

          <TranslatableInput
            label="شارة التميز (Badge) - اختياري"
            nameAr="badge_text.ar"
            nameEn="badge_text.en"
            register={register}
            placeholderAr="مثال: المؤسس، خبير UI/UX"
            placeholderEn="e.g. Founder, Lead Designer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">الترتيب</label>
              <Input
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                placeholder="1"
              />
            </div>

            <div className="flex flex-col gap-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="checkbox"
                  {...register('is_highlighted')}
                  className="w-4 h-4 rounded border-input text-amber-500 focus:ring-amber-500"
                />
                <span>عضو مميز (Highlight)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                />
                <span>تفعيل العضو (نشط)</span>
              </label>
            </div>
          </div>

          <ImageUploadPreview
            label="صورة العضو الشخصية"
            currentImageUrl={getMediaUrl(editingMember?.image)}
            onChange={setPhotoFile}
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
                Boolean(editingMember && !isDirty && !photoFile) || isLoading
              }
              className="rounded-xl px-6"
            >
              {editingMember ? 'حفظ التعديلات' : 'إضافة العضو'}
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TeamMemberFormDialog;
