import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LayoutTemplate, Edit } from 'lucide-react';
import { usePageSections, useUpdatePageSection } from '../hooks/useContent';
import { PageSection } from '../types/content.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { getDirtyValues, createPatchFormData } from '@/lib/dirtyValues';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function PageSectionsPage() {
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: res, isLoading, isError, refetch } = usePageSections();
  const { mutate: updateSection, isPending: updating } = useUpdatePageSection();

  const sections = res?.data || [];

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
    if (selectedSection) {
      reset({
        title: {
          ar: selectedSection.title?.ar || '',
          en: selectedSection.title?.en || '',
        },
        description: {
          ar: selectedSection.description?.ar || '',
          en: selectedSection.description?.en || '',
        },
      });
    }
  }, [selectedSection, reset]);

  const onEdit = (sec: PageSection) => {
    setSelectedSection(sec);
    setImageFile(null);
    setEditOpen(true);
  };

  const onSubmit = (data: { title: { ar: string; en: string }; description: { ar: string; en: string } }) => {
    if (!selectedSection) return;

    const original = {
      title: {
        ar: selectedSection.title?.ar || '',
        en: selectedSection.title?.en || '',
      },
      description: {
        ar: selectedSection.description?.ar || '',
        en: selectedSection.description?.en || '',
      },
    };

    const dirty = getDirtyValues(dirtyFields, data, original);

    if (Object.keys(dirty).length === 0 && !imageFile) {
      toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
      return;
    }

    const sectionKey = selectedSection.section_key || selectedSection.slug || '';
    const files: Record<string, File> = {};
    if (imageFile) {
      files.image = imageFile;
    }

    const payload = createPatchFormData(dirty, files);

    updateSection(
      { slug: sectionKey, data: payload },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedSection(null);
          setImageFile(null);
        },
      }
    );
  };

  const columns: Column<PageSection>[] = [
    {
      header: 'القسم',
      cell: (item) => {
        const imageUrl = getMediaUrl(item.image);
        const key = item.section_key || item.slug;
        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title?.ar}
                className="w-12 h-12 rounded-xl object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <LayoutTemplate className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">{item.title?.ar || item.title?.en}</p>
              <p className="text-xs text-muted-foreground font-mono">{key}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'الوصف / المحتوى',
      cell: (item) => (
        <p className="text-xs text-muted-foreground max-w-sm truncate">
          {item.description?.ar || item.description?.en || '—'}
        </p>
      ),
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl flex items-center gap-1.5"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>تعديل المحتوى</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <PageHeader
        title="أقسام ومحتوى الصفحات"
        description="تعديل نصوص وصور الأقسام الثابتة في صفحات الموقع (عن الشركة، تواصل، الرئيسية)"
      />

      <DataTable
        columns={columns}
        data={sections}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد أقسام مسجلة"
        emptyDescription="سيتم عرض أقسام الصفحات الثابتة هنا."
        keyExtractor={(item, index) => item.section_key || item.slug || item.id || index}
      />

      {/* Edit Section Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              تعديل قسم: {selectedSection?.title?.ar || selectedSection?.section_key || selectedSection?.slug}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
              currentImageUrl={getMediaUrl(selectedSection?.image)}
              onChange={setImageFile}
              aspectRatio="video"
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={updating}
                loadingText="جاري الحفظ..."
                disabled={(!isDirty && !imageFile) || updating}
                className="rounded-xl px-6"
              >
                حفظ التعديلات
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
