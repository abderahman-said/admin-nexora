import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PageSection } from '../types/content.types';
import { getDirtyValues, createPatchFormData } from '@/lib/dirtyValues';
import { getMediaUrl } from '@/lib/utils';
import { handleFormErrors } from '@/lib/formUtils';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PageSectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: PageSection | null;
  onUpdate: (slug: string, payload: FormData) => void;
  isLoading: boolean;
}

export function PageSectionFormDialog({
  open,
  onOpenChange,
  section,
  onUpdate,
  isLoading,
}: PageSectionFormDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<{
    title: { ar: string; en: string };
    description: { ar: string; en: string };
  }>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (section && open) {
      reset({
        title: {
          ar: section.title?.ar || '',
          en: section.title?.en || '',
        },
        description: {
          ar: section.description?.ar || '',
          en: section.description?.en || '',
        },
      });
      setImageFile(null);
    }
  }, [section, open, reset]);

  const handleFormSubmit = (data: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
  }) => {
    if (!section) return;

    const original = {
      title: {
        ar: section.title?.ar || '',
        en: section.title?.en || '',
      },
      description: {
        ar: section.description?.ar || '',
        en: section.description?.en || '',
      },
    };

    const dirty = getDirtyValues(dirtyFields, data, original);

    if (Object.keys(dirty).length === 0 && !imageFile) {
      toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
      return;
    }

    const sectionKey = section.section_key || section.slug || '';
    const files: Record<string, File> = {};
    if (imageFile) {
      files.image = imageFile;
    }

    const payload = createPatchFormData(dirty, files);
    onUpdate(sectionKey, payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-lg font-bold">
            تعديل قسم: {section?.title?.ar || section?.section_key || section?.slug}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-4 pt-2">
          <TranslatableInput
            label="عنوان القسم"
            nameAr="title.ar"
            nameEn="title.en"
            register={register}
            errorAr={errors.title?.ar?.message}
            errorEn={errors.title?.en?.message}
            required
          />

          <TranslatableInput
            label="نص / وصف القسم"
            nameAr="description.ar"
            nameEn="description.en"
            register={register}
            errorAr={errors.description?.ar?.message}
            errorEn={errors.description?.en?.message}
            isTextarea
            rows={4}
          />

          <ImageUploadPreview
            label="صورة القسم"
            currentImageUrl={getMediaUrl(section?.image)}
            onChange={setImageFile}
            aspectRatio="video"
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
              disabled={(!isDirty && !imageFile) || isLoading}
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

export default PageSectionFormDialog;
