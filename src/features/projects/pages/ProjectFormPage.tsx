import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, Briefcase } from 'lucide-react';
import { useProject, useCreateProject, useUpdateProject } from '../hooks/useProjects';
import { useServices } from '@/features/services/hooks/useServices';
import { ProjectFormData } from '../types/project.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);

  const { data: projectRes, isLoading: projectLoading } = useProject(id || '');
  const { data: servicesRes } = useServices();
  const { mutate: createProject, isPending: creating } = useCreateProject();
  const { mutate: updateProject, isPending: updating } = useUpdateProject(id || '');

  const services = servicesRes?.data || [];
  const isSaving = creating || updating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      service_id: '',
      slug: '',
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      is_featured: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (projectRes?.data) {
      const p = projectRes.data;
      reset({
        service_id: p.service_id || '',
        slug: p.slug || '',
        title: { ar: p.title?.ar || '', en: p.title?.en || '' },
        description: { ar: p.description?.ar || '', en: p.description?.en || '' },
        is_featured: Boolean(p.is_featured),
        is_active: p.is_active ?? true,
      });
      setCurrentCoverUrl(getMediaUrl(p.cover_image) || getMediaUrl(p.image) || null);
    }
  }, [projectRes, reset]);

  const onSubmit = (data: ProjectFormData) => {
    const payload = { ...data, cover_image: coverFile };
    if (isEdit && id) {
      updateProject(payload, {
        onSuccess: () => navigate('/dashboard/projects'),
      });
    } else {
      createProject(payload, {
        onSuccess: () => navigate('/dashboard/projects'),
      });
    }
  };

  if (isEdit && projectLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        جاري تحميل تفاصيل المشروع...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard/projects')}
          className="rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <PageHeader
          title={isEdit ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
          description="أدخل تفاصيل المشروع وصورة الغلاف والخدمة التابعة"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">بيانات المشروع</h3>
              <p className="text-xs text-muted-foreground">التصنيف والعناوين والروابط</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                الخدمة التابعة <span className="text-destructive">*</span>
              </label>
              <select
                {...register('service_id', { required: 'يرجى اختيار الخدمة التابعة' })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">اختر الخدمة...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title?.ar || s.title?.en}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <p className="text-xs text-destructive">{errors.service_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                الرابط الدائم (Slug) <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="مثال: store-app"
                {...register('slug', { required: 'الرابط الدائم مطلوب' })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <TranslatableInput
            label="اسم المشروع"
            nameAr="title.ar"
            nameEn="title.en"
            register={register}
            errorAr={errors.title?.ar?.message}
            errorEn={errors.title?.en?.message}
            required
          />

          <TranslatableInput
            label="وصف المشروع"
            nameAr="description.ar"
            nameEn="description.en"
            register={register}
            errorAr={errors.description?.ar?.message}
            errorEn={errors.description?.en?.message}
            isTextarea
            rows={4}
            required
          />

          <ImageUploadPreview
            label="صورة غلاف المشروع"
            currentImageUrl={currentCoverUrl}
            onChange={setCoverFile}
            aspectRatio="video"
          />

          <div className="flex flex-col sm:flex-row gap-6 pt-2 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 rounded text-primary focus:ring-primary/40"
              />
              <span className="text-sm font-medium text-foreground">
                تفعيل المشروع (مرئي للزوار)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_featured')}
                className="w-4 h-4 rounded text-primary focus:ring-primary/40"
              />
              <span className="text-sm font-medium text-foreground">
                تمييز المشروع (Featured Project)
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/projects')}
            className="rounded-xl px-6"
          >
            إلغاء
          </Button>

          <LoadingButton
            type="submit"
            loading={isSaving}
            loadingText="جاري الحفظ..."
            className="rounded-xl px-8 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'تحديث المشروع' : 'حفظ المشروع'}</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
