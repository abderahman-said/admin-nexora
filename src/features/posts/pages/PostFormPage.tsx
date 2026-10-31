import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Save, FileText } from 'lucide-react';
import { usePost, useCreatePost, useUpdatePost } from '../hooks/usePosts';
import { PostFormData } from '../types/post.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { useEditForm } from '@/hooks/useEditForm';
import { createPatchFormData } from '@/lib/dirtyValues';

const initialDefaultValues: PostFormData = {
  slug: '',
  title: { ar: '', en: '' },
  short_description: { ar: '', en: '' },
  content: { ar: '', en: '' },
  is_active: true,
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
    return {
      slug: p.slug || '',
      title: { ar: p.title?.ar || '', en: p.title?.en || '' },
      short_description: { ar: p.short_description?.ar || '', en: p.short_description?.en || '' },
      content: { ar: p.content?.ar || '', en: p.content?.en || '' },
      is_active: p.is_active ?? true,
    };
  }, [postRes]);

  const currentCoverUrl = postRes?.data
    ? getMediaUrl(postRes.data.image) || getMediaUrl(postRes.data.image_cover) || null
    : null;

  const {
    form: { register, formState: { errors } },
    hasChanges,
    handleSubmit,
  } = useEditForm<PostFormData>({
    defaultValues: initialDefaultValues,
    data: recordData,
    files: { image: coverFile },
    isEdit,
    onSubmit: (dirtyValues, allValues) => {
      if (isEdit && id) {
        // Send file ONLY if new one was selected; send ONLY changed fields
        if (coverFile) {
          const fd = createPatchFormData(dirtyValues, { image: coverFile });
          updatePost(fd, {
            onSuccess: () => navigate('/dashboard/blog'),
          });
        } else {
          updatePost(dirtyValues, {
            onSuccess: () => navigate('/dashboard/blog'),
          });
        }
      } else {
        const payload = { ...allValues, image: coverFile };
        createPost(payload, {
          onSuccess: () => navigate('/dashboard/blog'),
        });
      }
    },
  });

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
          description="أدخل محتوى وتفاصيل المقال والصورة البارزة"
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
              <p className="text-xs text-muted-foreground">العنوان والمحتوى بالعربية والإنجليزية</p>
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
              placeholder="مثال: how-to-choose-your-stack"
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
            label="موجز المقال"
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
            label="الصورة البارزة للمقال"
            currentImageUrl={currentCoverUrl}
            onChange={setCoverFile}
            aspectRatio="banner"
          />

          <div className="pt-2 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 rounded text-primary focus:ring-primary/40"
              />
              <span className="text-sm font-medium text-foreground">
                نشر المقال (جعله مرئياً في المدونة)
              </span>
            </label>
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
            <span>{isEdit ? 'تحديث المقال' : 'نشر المقال'}</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
