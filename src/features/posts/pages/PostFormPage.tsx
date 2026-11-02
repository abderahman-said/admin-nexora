import { ArrowRight, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { toKebabCase, isValidKebabCase } from '@/lib/utils';
import { usePostForm } from '../hooks/usePostForm';
import { PostPublishSettings } from '../components/PostPublishSettings';

export default function PostFormPage() {
  const {
    isEdit,
    postLoading,
    currentCoverUrl,
    setCoverFile,
    isSaving,
    hasChanges,
    handleSubmit,
    register,
    watch,
    setValue,
    errors,
    isPublished,
    navigate,
  } = usePostForm();

  if (isEdit && postLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل تفاصيل المقال...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard/blog')}
          className="rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <PageHeader
          title={isEdit ? 'تعديل المقال' : 'كتابة مقال جديد'}
          description="أدخل تفاصيل ومحتوى المقال وتاريخ النشر باللغتين العربية والإنجليزية"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">بيانات المقال</h3>
              <p className="text-xs text-muted-foreground">العنوان والرابط الدائم للمقال</p>
            </div>
          </div>

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
              placeholder="مثال: how-to-scale-nextjs"
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

          <TranslatableInput
            label="عنوان المقال"
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
            label="المحتوى الكامل"
            nameAr="content.ar"
            nameEn="content.en"
            register={register}
            errorAr={errors.content?.ar?.message}
            errorEn={errors.content?.en?.message}
            isTextarea
            rows={8}
            required
          />

          <ImageUploadPreview
            label="الصورة البارزة للمقال (Cover Image)"
            currentImageUrl={currentCoverUrl}
            onChange={setCoverFile}
            aspectRatio="banner"
          />

          <PostPublishSettings register={register} isPublished={Boolean(isPublished)} />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/blog')}
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
            <span>{isEdit ? 'تحديث المقال' : 'حفظ المقال'}</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
