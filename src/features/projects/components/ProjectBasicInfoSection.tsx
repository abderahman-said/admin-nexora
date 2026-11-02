import { Briefcase } from 'lucide-react';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import FormSelect from '@/components/shared/forms/FormSelect';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { toKebabCase, isValidKebabCase } from '@/lib/utils';
import { ProjectFormData } from '../types/project.types';
import { Service } from '@/features/services/types/service.types';

interface ProjectBasicInfoSectionProps {
  isEdit: boolean;
  services: Service[];
  currentCoverUrl: string | null;
  onCoverFileChange: (file: File | null) => void;
  register: UseFormRegister<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function ProjectBasicInfoSection({
  isEdit,
  services,
  currentCoverUrl,
  onCoverFileChange,
  register,
  watch,
  setValue,
  errors,
}: ProjectBasicInfoSectionProps) {
  const handleAutoGenerateSlug = () => {
    const source = watch('title.en') || watch('title.ar') || '';
    let generated = toKebabCase(source);
    if (!generated && watch('title.ar')) {
      generated = `project-${Date.now().toString().slice(-4)}`;
    }
    if (generated) {
      setValue('slug', generated, { shouldDirty: true, shouldValidate: true });
    } else {
      toast.error('يرجى كتابة اسم المشروع أولاً');
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">بيانات المشروع الأساسية</h3>
          <p className="text-xs text-muted-foreground">التصنيف والعناوين وصورة الغلاف</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <FormSelect
          label="الخدمة التابعة (اختياري)"
          placeholder="بدون خدمة تابعة (اختياري)"
          value={String(watch('service_id') || '')}
          onChange={(val) => setValue('service_id', val, { shouldDirty: true })}
          options={[
            { value: '', label: 'بدون خدمة تابعة (اختياري)' },
            ...services.map((s) => ({
              value: String(s.id),
              label: s.title?.ar || s.title?.en || String(s.id),
            })),
          ]}
          error={errors.service_id?.message}
        />

        <div className="space-y-1.5">
          <div className="h-5 flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <span>الرابط الدائم (Slug)</span>
              {!isEdit && <span className="text-danger">*</span>}
              {isEdit && (
                <span className="text-[11px] text-muted-foreground font-normal">
                  (غير قابل للتعديل)
                </span>
              )}
            </label>
            {!isEdit && (
              <button
                type="button"
                onClick={handleAutoGenerateSlug}
                className="text-xs text-primary hover:underline font-medium"
              >
                توليد تلقائي
              </button>
            )}
          </div>
          <Input
            type="text"
            dir="ltr"
            disabled={isEdit}
            placeholder="مثال: my-project-name"
            error={Boolean(errors.slug)}
            value={watch('slug') || ''}
            {...register('slug', {
              required: !isEdit ? 'الرابط الدائم (Slug) مطلوب' : false,
              maxLength: { value: 100, message: 'الحد الأقصى للرابط هو 100 حرف' },
              validate: (val) => {
                if (isEdit) return true;
                if (!val || !val.trim()) return 'الرابط الدائم (Slug) مطلوب';
                if (!isValidKebabCase(val)) {
                  return 'يجب أن يكون معرّفًا بصيغة kebab-case (أحرف إنجليزية صغيرة وأرقام وشرطات فقط بدون مسافات، مثل: my-project)';
                }
                return true;
              },
            })}
            onChange={(e) => {
              const raw = e.target.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-');
              setValue('slug', raw, { shouldDirty: true, shouldValidate: true });
            }}
            onBlur={() => {
              const current = watch('slug') || '';
              if (current) {
                const cleaned = toKebabCase(current);
                setValue('slug', cleaned, { shouldDirty: true, shouldValidate: true });
              }
            }}
            className={
              isEdit
                ? 'opacity-60 cursor-not-allowed bg-muted/30 font-mono text-xs'
                : 'font-mono text-xs'
            }
          />
          {errors.slug ? (
            <p className="text-xs text-danger font-medium">{errors.slug.message}</p>
          ) : (
            !isEdit && (
              <p className="text-[11px] text-muted-foreground font-mono">
                أحرف إنجليزية صغيرة وأرقام وشرطات فقط بدون مسافات (kebab-case)
              </p>
            )
          )}
        </div>

        <div className="space-y-1.5">
          <div className="h-5 flex items-center">
            <label className="text-xs font-semibold text-foreground">الترتيب (Sort Order)</label>
          </div>
          <Input
            type="number"
            min="0"
            {...register('sort_order', { valueAsNumber: true })}
          />
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
        label="وصف المشروع (اختياري)"
        nameAr="description.ar"
        nameEn="description.en"
        register={register}
        errorAr={errors.description?.ar?.message}
        errorEn={errors.description?.en?.message}
        isTextarea
        rows={4}
      />

      <ImageUploadPreview
        label="صورة غلاف المشروع الرئيسية (Cover Image)"
        currentImageUrl={currentCoverUrl}
        onChange={onCoverFileChange}
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
  );
}

export default ProjectBasicInfoSection;
