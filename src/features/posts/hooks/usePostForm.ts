import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { usePost, useCreatePost, useUpdatePost } from './usePosts';
import { PostFormData } from '../types/post.types';
import { useEditForm } from '@/hooks/useEditForm';
import { getMediaUrl, toKebabCase, isValidKebabCase } from '@/lib/utils';
import { INITIAL_POST_FORM_VALUES } from '../constants/postForm.constants';

export function usePostForm() {
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
      short_description: {
        ar: p.short_description?.ar || '',
        en: p.short_description?.en || '',
      },
      content: { ar: p.content?.ar || '', en: p.content?.en || '' },
      published_at: p.published_at || null,
      is_published: isPub,
    };
  }, [postRes]);

  const currentCoverUrl = postRes?.data
    ? getMediaUrl(postRes.data.image) || getMediaUrl(postRes.data.image_cover) || null
    : null;

  const {
    form: {
      register,
      watch,
      setValue,
      formState: { errors },
    },
    hasChanges,
    handleSubmit,
  } = useEditForm<PostFormData>({
    defaultValues: INITIAL_POST_FORM_VALUES,
    data: recordData,
    files: { image: coverFile },
    isEdit,
    onSubmit: (dirtyValues, allValues) => {
      if (!isEdit) {
        const rawSlug = (allValues.slug || watch('slug') || '').trim();
        if (!rawSlug) {
          toast.error('الرابط الدائم (Slug) مطلوب');
          return;
        }
        const cleanSlug = toKebabCase(rawSlug);
        if (!isValidKebabCase(rawSlug) || rawSlug !== cleanSlug) {
          toast.error(
            'يجب أن يكون الرابط الدائم (Slug) معرّفًا بصيغة kebab-case (أحرف إنجليزية صغيرة وأرقام وشرطات فقط)'
          );
          return;
        }
      }

      if (isEdit && id) {
        updatePost(
          { ...dirtyValues, image: coverFile },
          {
            onSuccess: () => navigate('/dashboard/blog'),
          }
        );
      } else {
        createPost(
          { ...allValues, image: coverFile },
          {
            onSuccess: () => navigate('/dashboard/blog'),
          }
        );
      }
    },
  });

  const isPublished = watch('is_published');

  return {
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
  };
}

export default usePostForm;
