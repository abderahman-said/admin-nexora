import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, FileText, Calendar } from 'lucide-react';
import { usePost, useCreatePost, useUpdatePost } from '../hooks/usePosts';
import { PostFormData } from '../types/post.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { useEditForm } from '@/hooks/useEditForm';

const initialDefaultValues: PostFormData = {
  slug: '',
  title: { ar: '', en: '' },
  short_description: { ar: '', en: '' },
  content: { ar: '', en: '' },
  published_at: null,
  is_published: true,
};

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: postRes, isLoading: postLoading } = usePost(id || '');
  const { mutate: createPost, isPending: creating } = useCreatePost();
  const { mutate: updatePost, isPending: updating } = useUpdatePost(id || '');

  const isSaving = creating || updating;

  const recordData = useMemo<PostFormData | null>(() => {
    if (!postRes?.data) return null;
    const p = postRes.data;
    const isPub = Boolean(p.published_at && new Date(p.published_at) <= new Date());
    return {
      slug: p.slug || '',
      title: { ar: p.title?.ar || '', en: p.title?.en || '' },
      short_description: { ar: p.short_description?.ar || '', en: p.short_description?.en || '' },
      content: { ar: p.content?.ar || '', en: p.content?.en || '' },
      published_at: p.published_at || null,
      is_published: isPub,
    };
  }, [postRes]);

  const currentCoverUrl = postRes?.data
    ? getMediaUrl(postRes.data.image) || getMediaUrl(postRes.data.image_cover) || null
    : null;

  const {
    form: { register, watch, formState: { errors } },
    hasChanges,
    handleSubmit,
  } = useEditForm<PostFormData>({
    defaultValues: initialDefaultValues,
    data: recordData,
    files: { image: coverFile },
    isEdit,
    onSubmit: (dirtyValues, allValues) => {
      if (isEdit && id) {
        updatePost({ ...dirtyValues, image: coverFile }, {
          onSuccess: () => navigate('/dashboard/blog'),
        });
      } else {
        createPost({ ...allValues, image: coverFile }, {
          onSuccess: () => navigate('/dashboard/blog'),
        });
      }
    },
  });

  const isPublished = watch('is_published');

  if (isEdit && postLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل تفاصيل المقال...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              الرابط الدائم (Slug) {isEdit && <span className="text-xs text-muted-foreground font-normal">(غير قابل للتعديل)</span>}
              {!isEdit && <span className="text-destructive">*</span>}
            </label>
            <input
              type="text"
              dir="ltr"
              disabled={isEdit}
              placeholder="مثال: how-to-scale-nextjs"
              {...register('slug', { required: !isEdit ? 'الرابط الدائم مطلوب' : false })}
              className={`w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                isEdit ? 'opacity-60 cursor-not-allowed bg-muted/30' : ''
              }`}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
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

          {/* Publishing Settings */}
          <div className="pt-4 border-t space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>حالة النشر والجدولة (Publishing Status)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-3.5 border rounded-xl bg-muted/10 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_published')}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/40"
                />
                <div>
                  <span className="text-sm font-semibold text-foreground block">
                    نشر المقال الآن
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    إذا تم إلغاء التحديد، سيتم حفظ المقال كمسودة غير مرئية للزوار
                  </span>
                </div>
              </label>

              {isPublished && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    تاريخ ووقت النشر المحدد (اختياري للجدولة المستقبلية)
                  </label>
                  <input
                    type="datetime-local"
                    {...register('published_at')}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}
            </div>
          </div>
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
