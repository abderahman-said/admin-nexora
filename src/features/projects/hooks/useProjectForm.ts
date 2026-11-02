import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useProject, useCreateProject, useUpdateProject } from './useProjects';
import { useServices } from '@/features/services/hooks/useServices';
import { ProjectFormData, ProjectPart } from '../types/project.types';
import { useEditForm } from '@/hooks/useEditForm';
import { toProjectCreatePayload, toProjectUpdatePayload } from '../api/projectsApi';
import { getMediaUrl, toKebabCase, isValidKebabCase } from '@/lib/utils';
import { handleFormErrors } from '@/lib/formUtils';
import {
  DEFAULT_PART_TEMPLATE,
  INITIAL_PROJECT_FORM_VALUES,
} from '../constants/projectForm.constants';

export function useProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: projectRes, isLoading: projectLoading } = useProject(id || '');
  const { data: servicesRes } = useServices();
  const { mutate: createProject, isPending: creating } = useCreateProject();
  const { mutate: updateProject, isPending: updating } = useUpdateProject(id || '');

  const services = servicesRes?.data || [];
  const isSaving = creating || updating;

  // Normalized data from query
  const recordData = useMemo<ProjectFormData | null>(() => {
    if (!projectRes?.data) return null;
    const p = projectRes.data;
    return {
      service_id: p.service_id || '',
      slug: p.slug || '',
      title: { ar: p.title?.ar || '', en: p.title?.en || '' },
      description: { ar: p.description?.ar || '', en: p.description?.en || '' },
      sort_order: p.sort_order ?? 1,
      is_featured: Boolean(p.is_featured),
      is_active: p.is_active ?? true,
      parts:
        p.parts && p.parts.length > 0
          ? p.parts.map((part) => {
              const rawType = String(part.type || '').toLowerCase();
              const normType: 'website' | 'mobile_app' =
                rawType === 'mobile_app' || rawType === 'mobile' ? 'mobile_app' : 'website';
              return {
                type: normType,
                title: { ar: part.title?.ar || '', en: part.title?.en || '' },
                description: { ar: part.description?.ar || '', en: part.description?.en || '' },
                website_url: part.website_url || '',
                app_store_url: part.app_store_url || '',
                google_play_url: part.google_play_url || '',
                technologies: part.technologies || [],
                apps: part.apps || [],
                images: part.images || [],
                newImageFiles: [],
              };
            })
          : [DEFAULT_PART_TEMPLATE],
    };
  }, [projectRes]);

  const currentCoverUrl = projectRes?.data
    ? getMediaUrl(projectRes.data.cover_image) || getMediaUrl(projectRes.data.image) || null
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
  } = useEditForm<ProjectFormData>({
    defaultValues: INITIAL_PROJECT_FORM_VALUES,
    data: recordData,
    files: { cover_image: coverFile },
    isEdit,
    onSubmit: (dirtyValues, allValues) => {
      const currentParts = watch('parts') || allValues.parts || [];
      if (currentParts.length === 0) {
        toast.error('يجب إضافة جزء واحد على الأقل للمشروع');
        return;
      }

      if (!allValues.title?.ar?.trim()) {
        handleFormErrors({ title: { ar: { message: 'يرجى إدخال اسم المشروع باللغة العربية' } } } as any);
        return;
      }

      if (!allValues.title?.en?.trim()) {
        handleFormErrors({ title: { en: { message: 'يرجى إدخال اسم المشروع باللغة الإنجليزية' } } } as any);
        return;
      }

      // Validate slug on create (must be strict kebab-case)
      if (!isEdit) {
        const rawSlug = (allValues.slug || watch('slug') || '').trim();
        if (!rawSlug) {
          toast.error('الرابط الدائم (Slug) مطلوب');
          return;
        }
        const cleanSlug = toKebabCase(rawSlug);
        if (!isValidKebabCase(rawSlug) || rawSlug !== cleanSlug) {
          toast.error(
            'يجب أن يكون الرابط الدائم (Slug) معرّفًا بصيغة kebab-case (أحرف إنجليزية صغيرة وأرقام وشرطات فقط مثل: my-project)'
          );
          return;
        }
      }

      // Validate each part: title and images are strictly REQUIRED
      for (let i = 0; i < currentParts.length; i++) {
        const p = currentParts[i];
        const partNum = i + 1;
        const partName = p.title?.ar?.trim() || `الجزء رقم ${partNum}`;

        if (!p.title?.ar?.trim()) {
          toast.error(`يرجى إدخال عنوان الجزء بالعربية (الجزء رقم ${partNum})`);
          return;
        }

        const existingCount = (p.images || []).length;
        const newCount = (p.newImageFiles || []).length;
        const totalImages = existingCount + newCount;

        if (totalImages === 0) {
          toast.error(`الصورة مطلوبة: يرجى رفع صورة واحدة على الأقل للجزء "${partName}"`);
          return;
        }

        const maxAllowed = p.type === 'website' ? 1 : 3;
        if (totalImages > maxAllowed) {
          toast.error(
            `الحد الأقصى لصور ${p.type === 'website' ? 'موقع الويب' : 'تطبيق الهاتف'} هو ${maxAllowed} (الجزء "${partName}")`
          );
          return;
        }
      }

      if (isEdit && id) {
        const payload = toProjectUpdatePayload(dirtyValues, coverFile, currentParts);
        updateProject(payload, {
          onSuccess: () => navigate('/dashboard/projects'),
        });
      } else {
        const payload = toProjectCreatePayload({ ...allValues, parts: currentParts }, coverFile);
        createProject(payload, {
          onSuccess: () => navigate('/dashboard/projects'),
        });
      }
    },
  });

  const parts = watch('parts') || [];

  // Helper for immutable field updates on any part
  const updatePartField = useCallback(
    <K extends keyof ProjectPart>(pIdx: number, field: K, val: ProjectPart[K]) => {
      const currentParts = watch('parts') || [];
      const updated = currentParts.map((p, idx) => {
        if (idx !== pIdx) return p;
        return { ...p, [field]: val };
      });
      setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
    },
    [watch, setValue]
  );

  // Part type change handler (website <-> mobile_app)
  const handlePartTypeChange = useCallback(
    (pIdx: number, newType: 'website' | 'mobile_app') => {
      const currentParts = watch('parts') || [];
      const current = currentParts[pIdx];
      if (!current || current.type === newType) return;

      const isNewWebsite = newType === 'website';
      const oldDefaultAr = isNewWebsite ? 'تطبيق الهاتف' : 'الموقع الإلكتروني';
      const oldDefaultEn = isNewWebsite ? 'Mobile App' : 'Website';
      const newDefaultAr = isNewWebsite ? 'الموقع الإلكتروني' : 'تطبيق الهاتف';
      const newDefaultEn = isNewWebsite ? 'Website' : 'Mobile App';

      let title = { ...current.title };
      if (!title.ar || title.ar === oldDefaultAr || title.ar === 'جزء جديد') {
        title.ar = newDefaultAr;
      }
      if (!title.en || title.en === oldDefaultEn || title.en === 'New Part') {
        title.en = newDefaultEn;
      }

      const adjustedImages = isNewWebsite ? (current.images || []).slice(0, 1) : (current.images || []);
      const adjustedNewFiles = isNewWebsite ? (current.newImageFiles || []).slice(0, 1) : (current.newImageFiles || []);

      const updated = currentParts.map((p, idx) => {
        if (idx !== pIdx) return p;
        return {
          ...p,
          type: newType,
          title,
          website_url: p.website_url || '',
          app_store_url: isNewWebsite ? '' : p.app_store_url || '',
          google_play_url: isNewWebsite ? '' : p.google_play_url || '',
          apps: isNewWebsite ? [] : (p.apps || []),
          images: adjustedImages,
          newImageFiles: adjustedNewFiles,
        };
      });

      setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
    },
    [watch, setValue]
  );

  const handleAddPart = useCallback(() => {
    const currentParts = watch('parts') || [];
    if (currentParts.length >= 6) {
      toast.error('الحد الأقصى لأجزاء المشروع هو 6 أجزاء');
      return;
    }
    setValue('parts', [...currentParts, DEFAULT_PART_TEMPLATE], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [watch, setValue]);

  const handleRemovePart = useCallback(
    (index: number) => {
      const currentParts = watch('parts') || [];
      if (currentParts.length <= 1) {
        toast.error('يجب أن يحتوي المشروع على جزء واحد على الأقل');
        return;
      }
      const updated = currentParts.filter((_, i) => i !== index);
      setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
    },
    [watch, setValue]
  );

  const handlePartImagesChange = useCallback(
    (index: number, files: FileList | null) => {
      if (!files || files.length === 0) return;
      const currentParts = watch('parts') || [];
      const currentPart = currentParts[index];
      if (!currentPart) return;

      const isWebsite = currentPart.type === 'website';
      const maxImages = isWebsite ? 1 : 3;
      const existingCount = currentPart.images?.length || 0;
      const currentNewFiles = currentPart.newImageFiles || [];
      const newFiles = Array.from(files);

      if (isWebsite) {
        const updated = currentParts.map((p, idx) =>
          idx === index ? { ...p, newImageFiles: newFiles.slice(0, 1) } : p
        );
        setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
        return;
      }

      if (existingCount + currentNewFiles.length + newFiles.length > maxImages) {
        toast.error(`الحد الأقصى لصور التطبيق هو ${maxImages}`);
        return;
      }

      const updated = currentParts.map((p, idx) =>
        idx === index ? { ...p, newImageFiles: [...currentNewFiles, ...newFiles] } : p
      );
      setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
    },
    [watch, setValue]
  );

  const handleRemoveExistingImage = useCallback(
    (partIndex: number, imgIndex: number) => {
      const currentParts = watch('parts') || [];
      const updated = currentParts.map((p, idx) => {
        if (idx !== partIndex) return p;
        return {
          ...p,
          images: (p.images || []).filter((_, i) => i !== imgIndex),
        };
      });
      setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
    },
    [watch, setValue]
  );

  const handleRemoveNewImage = useCallback(
    (partIndex: number, fileIndex: number) => {
      const currentParts = watch('parts') || [];
      const updated = currentParts.map((p, idx) => {
        if (idx !== partIndex) return p;
        return {
          ...p,
          newImageFiles: (p.newImageFiles || []).filter((_, i) => i !== fileIndex),
        };
      });
      setValue('parts', updated, { shouldDirty: true, shouldValidate: true });
    },
    [watch, setValue]
  );

  const updateSubApp = useCallback(
    (
      pIdx: number,
      appIdx: number,
      field: 'title' | 'description',
      lang: 'ar' | 'en',
      val: string
    ) => {
      const currentParts = watch('parts') || [];
      const currentPart = currentParts[pIdx];
      if (!currentPart) return;
      const apps = [...(currentPart.apps || [])];
      const targetApp = apps[appIdx] || {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
      };
      const targetField = { ...(targetApp[field] || { ar: '', en: '' }), [lang]: val };
      apps[appIdx] = { ...targetApp, [field]: targetField };
      updatePartField(pIdx, 'apps', apps);
    },
    [watch, updatePartField]
  );

  const handleAddSubApp = useCallback(
    (pIdx: number) => {
      const currentParts = watch('parts') || [];
      const currentPart = currentParts[pIdx];
      if (!currentPart) return;
      const currentApps = currentPart.apps || [];
      updatePartField(pIdx, 'apps', [
        ...currentApps,
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
      ]);
    },
    [watch, updatePartField]
  );

  const handleRemoveSubApp = useCallback(
    (pIdx: number, appIdx: number) => {
      const currentParts = watch('parts') || [];
      const currentPart = currentParts[pIdx];
      if (!currentPart) return;
      const currentApps = currentPart.apps || [];
      updatePartField(
        pIdx,
        'apps',
        currentApps.filter((_, i) => i !== appIdx)
      );
    },
    [watch, updatePartField]
  );

  return {
    isEdit,
    projectLoading,
    services,
    currentCoverUrl,
    coverFile,
    setCoverFile,
    isSaving,
    hasChanges,
    handleSubmit,
    register,
    watch,
    setValue,
    errors,
    parts,
    navigate,
    updatePartField,
    handlePartTypeChange,
    handleAddPart,
    handleRemovePart,
    handlePartImagesChange,
    handleRemoveExistingImage,
    handleRemoveNewImage,
    updateSubApp,
    handleAddSubApp,
    handleRemoveSubApp,
  };
}
