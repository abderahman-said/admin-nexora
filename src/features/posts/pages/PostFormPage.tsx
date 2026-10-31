import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);

  const { data: postRes, isLoading: postLoading } = usePost(id || '');
  const { mutate: createPost, isPending: creating } = useCreatePost();
  const { mutate: updatePost, isPending: updating } = useUpdatePost(id || '');

  const isSaving = creating || updating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      slug: '',
      title: { ar: '', en: '' },
      short_description: { ar: '', en: '' },
      content: { ar: '', en: '' },
      is_active: true,
    },
  });

  useEffect(() => {
    if (postRes?.data) {
      const p = postRes.data;
      reset({
        slug: p.slug || '',
        title: { ar: p.title?.ar || '', en: p.title?.en || '' },
        short_description: { ar: p.short_description?.ar || '', en: p.short_description?.en || '' },
        content: { ar: p.content?.ar || '', en: p.content?.en || '' },
        is_active: p.is_active ?? true,
      });
      setCurrentCoverUrl(getMediaUrl(p.image) || getMediaUrl(p.image_cover) || null);
    }
  }, [postRes, reset]);

  const onSubmit = (data: PostFormData) => {
    const payload = { ...data, image: coverFile };
    if (isEdit && id) {
      updatePost(payload, {
        onSuccess: () => navigate('/dashboard/blog'),
      });
    } else {
      createPost(payload, {
        onSuccess: () => navigate('/dashboard/blog'),
      });
    }
  };

  if (isEdit && postLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
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
              الرابط الدائم (Slug) <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              placeholder="مثال: how-to-choose-your-stack"
              {...register('slug', { required: 'الرابط الدائم مطلوب' })}
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
