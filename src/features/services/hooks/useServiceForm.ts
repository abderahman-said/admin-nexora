import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useService, useCreateService, useUpdateService } from './useServices';
import { ServiceFormData } from '../types/service.types';
import { useEditForm } from '@/hooks/useEditForm';
import { getMediaUrl, toKebabCase, isValidKebabCase } from '@/lib/utils';
import { INITIAL_SERVICE_FORM_VALUES } from '../constants/serviceForm.constants';

export function useServiceForm() {
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
      short_description: {
        ar: s.short_description?.ar || '',
        en: s.short_description?.en || '',
      },
      full_description: {
        ar: s.full_description?.ar || '',
        en: s.full_description?.en || '',
      },
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
    form: {
      register,
      watch,
      setValue,
      formState: { errors },
    },
    hasChanges,
    handleSubmit,
  } = useEditForm<ServiceFormData>({
    defaultValues: INITIAL_SERVICE_FORM_VALUES,
    data: recordData,
    files: { icon: iconFile },
    isEdit,
    onSubmit: (payload, allValues) => {
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
        updateService(
          { ...payload, icon: iconFile },
          {
            onSuccess: () => navigate('/dashboard/services'),
          }
        );
      } else {
        createService(
          { ...allValues, icon: iconFile },
          {
            onSuccess: () => navigate('/dashboard/services'),
          }
        );
      }
    },
  });

  const features = watch('features') || [];

  const handleAddFeature = useCallback(() => {
    const currentFeatures = watch('features') || [];
    if (currentFeatures.length >= 20) {
      toast.error('الحد الأقصى للميزات هو 20 ميزة');
      return;
    }
    setValue(
      'features',
      [
        ...currentFeatures,
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
      ],
      { shouldDirty: true }
    );
  }, [watch, setValue]);

  const handleRemoveFeature = useCallback(
    (index: number) => {
      const currentFeatures = watch('features') || [];
      setValue(
        'features',
        currentFeatures.filter((_, i) => i !== index),
        { shouldDirty: true }
      );
    },
    [watch, setValue]
  );

  const handleUpdateFeatureTitle = useCallback(
    (index: number, lang: 'ar' | 'en', value: string) => {
      const currentFeatures = watch('features') || [];
      const updated = currentFeatures.map((f, i) => {
        if (i !== index) return f;
        return {
          ...f,
          title: {
            ...f.title,
            [lang]: value,
          },
        };
      });
      setValue('features', updated, { shouldDirty: true });
    },
    [watch, setValue]
  );

  return {
    isEdit,
    serviceLoading,
    currentIconUrl,
    setIconFile,
    isSaving,
    hasChanges,
    handleSubmit,
    register,
    watch,
    setValue,
    errors,
    features,
    navigate,
    handleAddFeature,
    handleRemoveFeature,
    handleUpdateFeatureTitle,
  };
}

export default useServiceForm;
