import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, Layers, Plus, Trash2 } from 'lucide-react';
import { useService, useCreateService, useUpdateService } from '../hooks/useServices';
import { ServiceFormData } from '../types/service.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { useEditForm } from '@/hooks/useEditForm';
import { getMediaUrl } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const initialDefaultValues: ServiceFormData = {
  slug: '',
  title: { ar: '', en: '' },
  short_description: { ar: '', en: '' },
  full_description: { ar: '', en: '' },
  is_featured: false,
  is_active: true,
  sort_order: 1,
  features: [],
};

export default function ServiceFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [iconFile, setIconFile] = useState<File | null>(null);

  const { data: serviceRes, isLoading: serviceLoading } = useService(id || '');
  const { mutate: createService, isPending: creating } = useCreateService();
  const { mutate: updateService, isPending: updating } = useUpdateService(id || '');

  const isSaving = creating || updating;

  // Normalized record data for edit mode
  const recordData = useMemo<ServiceFormData | null>(() => {
    if (!serviceRes?.data) return null;
    const s = serviceRes.data;
    return {
      slug: s.slug || '',
      title: { ar: s.title?.ar || '', en: s.title?.en || '' },
      short_description: { ar: s.short_description?.ar || '', en: s.short_description?.en || '' },
      full_description: { ar: s.full_description?.ar || '', en: s.full_description?.en || '' },
      is_featured: Boolean(s.is_featured),
      is_active: s.is_active ?? true,
      sort_order: s.sort_order ?? 1,
      features: s.features || [],
    };
  }, [serviceRes]);

  const currentIconUrl = serviceRes?.data
    ? getMediaUrl(serviceRes.data.icon)
    : null;

  const {
    form: { register, watch, setValue, formState: { errors } },
    hasChanges,
    handleSubmit,
  } = useEditForm<ServiceFormData>({
    defaultValues: initialDefaultValues,
    data: recordData,
    files: { icon: iconFile },
    isEdit,
    onSubmit: (payload, allValues) => {
      if (isEdit && id) {
        updateService({ ...payload, icon: iconFile }, {
          onSuccess: () => navigate('/dashboard/services'),
        });
      } else {
        createService({ ...allValues, icon: iconFile }, {
          onSuccess: () => navigate('/dashboard/services'),
        });
      }
    },
  });

  const features = watch('features') || [];

  const handleAddFeature = () => {
    if (features.length >= 20) {
      toast.error('الحد الأقصى للميزات هو 20 ميزة');
      return;
    }
    setValue(
      'features',
      [...features, { title: { ar: '', en: '' }, description: { ar: '', en: '' } }],
      { shouldDirty: true }
    );
  };

  const handleRemoveFeature = (index: number) => {
    setValue(
      'features',
      features.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  if (isEdit && serviceLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
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
          description="أدخل تفاصيل ومواصفات الخدمة، الأيقونة والميزات بالعربية والإنجليزية"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                الرابط الدائم (Slug) {isEdit && <span className="text-xs text-muted-foreground font-normal">(غير قابل للتعديل)</span>}
                {!isEdit && <span className="text-destructive">*</span>}
              </label>
              <input
                type="text"
                dir="ltr"
                disabled={isEdit}
                placeholder="مثال: web-development أو mobile-apps"
                {...register('slug', { required: !isEdit ? 'الرابط الدائم مطلوب' : false })}
                className={`w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  isEdit ? 'opacity-60 cursor-not-allowed bg-muted/30' : ''
                }`}
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">الترتيب (Sort Order)</label>
              <input
                type="number"
                min="0"
                {...register('sort_order', { valueAsNumber: true })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
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

          {/* Icon Upload */}
          <ImageUploadPreview
            label="أيقونة أو صورة الخدمة (Icon)"
            currentImageUrl={currentIconUrl}
            onChange={setIconFile}
            aspectRatio="square"
          />

          <div className="flex flex-col sm:flex-row gap-6 pt-2 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 rounded text-primary focus:ring-primary/40"
              />
              <span className="text-sm font-medium text-foreground">
                تفعيل الخدمة وجعلها مرئية في الموقع
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_featured')}
                className="w-4 h-4 rounded text-primary focus:ring-primary/40"
              />
              <span className="text-sm font-medium text-foreground">
                تمييز الخدمة (Featured Service)
              </span>
            </label>
          </div>
        </div>

        {/* Service Features Builder */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-foreground">ميزات الخدمة (Features)</h3>
              <p className="text-xs text-muted-foreground">أضف النقاط والمزايا البارزة المشمولة بهذه الخدمة</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
              className="rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة ميزة</span>
            </Button>
          </div>

          {features.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
              لم تتم إضافة أي ميزات بعد. اضغط "إضافة ميزة" للبدء.
            </div>
          ) : (
            <div className="space-y-4">
              {features.map((feat, fIdx) => (
                <div key={fIdx} className="p-4 border rounded-xl bg-muted/20 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">ميزة #{fIdx + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeature(fIdx)}
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={feat.title?.ar || ''}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[fIdx].title.ar = e.target.value;
                        setValue('features', updated, { shouldDirty: true });
                      }}
                      placeholder="عنوان الميزة (عربي) *"
                      className="h-10 px-3 rounded-xl border bg-background text-sm"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={feat.title?.en || ''}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[fIdx].title.en = e.target.value;
                        setValue('features', updated, { shouldDirty: true });
                      }}
                      placeholder="Feature Title (EN)"
                      className="h-10 px-3 rounded-xl border bg-background text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
            disabled={(isEdit && !hasChanges) || isSaving}
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
