import { Layers } from 'lucide-react';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { toKebabCase, isValidKebabCase } from '@/lib/utils';
import { ServiceFormData } from '../types/service.types';

interface ServiceBasicInfoSectionProps {
  isEdit: boolean;
  currentIconUrl: string | null;
  onIconFileChange: (file: File | null) => void;
  register: UseFormRegister<ServiceFormData>;
  watch: UseFormWatch<ServiceFormData>;
  setValue: UseFormSetValue<ServiceFormData>;
  errors: FieldErrors<ServiceFormData>;
}

export function ServiceBasicInfoSection({
  isEdit,
  currentIconUrl,
  onIconFileChange,
  register,
  watch,
  setValue,
  errors,
}: ServiceBasicInfoSectionProps) {
  return (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
          </div>
          <Input
            type="text"
            dir="ltr"
            disabled={isEdit}
            placeholder="مثال: web-development أو mobile-apps"
            error={Boolean(errors.slug)}
            value={watch('slug') || ''}
            {...register('slug', {
              required: !isEdit ? 'الرابط الدائم (Slug) مطلوب' : false,
              maxLength: { value: 100, message: 'الحد الأقصى للرابط هو 100 حرف' },
              validate: (val) => {
                if (isEdit) return true;
                if (!val || !val.trim()) return 'الرابط الدائم (Slug) مطلوب';
                if (!isValidKebabCase(val)) {
                  return 'يجب أن يكون معرّفًا بصيغة kebab-case (أحرف إنجليزية صغيرة وأرقام وشرطات فقط بدون مسافات)';
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
            <label className="text-xs font-semibold text-foreground">
              الترتيب (Sort Order)
            </label>
          </div>
          <Input
            type="number"
            min="0"
            {...register('sort_order', { valueAsNumber: true })}
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
        onChange={onIconFileChange}
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
  );
}

export default ServiceBasicInfoSection;
