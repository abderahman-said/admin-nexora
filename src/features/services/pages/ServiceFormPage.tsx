import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, Layers } from 'lucide-react';
import { useService, useCreateService, useUpdateService } from '../hooks/useServices';
import { ServiceFormData } from '../types/service.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';

export default function ServiceFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: serviceRes, isLoading: serviceLoading } = useService(id || '');
  const { mutate: createService, isPending: creating } = useCreateService();
  const { mutate: updateService, isPending: updating } = useUpdateService(id || '');

  const isSaving = creating || updating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: {
      slug: '',
      title: { ar: '', en: '' },
      short_description: { ar: '', en: '' },
      full_description: { ar: '', en: '' },
      is_active: true,
    },
  });

  useEffect(() => {
    if (serviceRes?.data) {
      const s = serviceRes.data;
      reset({
        slug: s.slug || '',
        title: { ar: s.title?.ar || '', en: s.title?.en || '' },
        short_description: { ar: s.short_description?.ar || '', en: s.short_description?.en || '' },
        full_description: { ar: s.full_description?.ar || '', en: s.full_description?.en || '' },
        is_active: s.is_active ?? true,
      });
    }
  }, [serviceRes, reset]);

  const onSubmit = (data: ServiceFormData) => {
    if (isEdit && id) {
      updateService(data, {
        onSuccess: () => navigate('/dashboard/services'),
      });
    } else {
      createService(data, {
        onSuccess: () => navigate('/dashboard/services'),
      });
    }
  };

  if (isEdit && serviceLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        جاري تحميل بيانات الخدمة...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard/services')}
          className="rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <PageHeader
          title={isEdit ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
          description="أدخل تفاصيل ومواصفات الخدمة بالعربية والإنجليزية"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">البيانات الأساسية</h3>
              <p className="text-xs text-muted-foreground">العنوان والرابط التعريفي للخدمة</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              الرابط الدائم (Slug) <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              placeholder="مثال: web-development أو mobile-apps"
              {...register('slug', { required: 'الرابط الدائم مطلوب' })}
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <TranslatableInput
            label="عنوان الخدمة"
            nameAr="title.ar"
            nameEn="title.en"
            register={register}
            errorAr={errors.title?.ar?.message}
            errorEn={errors.title?.en?.message}
            required
          />

          <TranslatableInput
            label="الوصف المختصر"
            nameAr="short_description.ar"
            nameEn="short_description.en"
            register={register}
            errorAr={errors.short_description?.ar?.message}
            errorEn={errors.short_description?.en?.message}
            isTextarea
            rows={3}
            required
          />

          <TranslatableInput
            label="الوصف الكامل"
            nameAr="full_description.ar"
            nameEn="full_description.en"
            register={register}
            errorAr={errors.full_description?.ar?.message}
            errorEn={errors.full_description?.en?.message}
            isTextarea
            rows={5}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 rounded text-primary focus:ring-primary/40"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
              تفعيل الخدمة وجعلها مرئية في الموقع
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/services')}
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
            <span>{isEdit ? 'تحديث الخدمة' : 'حفظ الخدمة'}</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
