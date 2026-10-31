import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Save,
  Briefcase,
  Layers,
  Plus,
  Trash2,
  Globe,
  Smartphone,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { useProject, useCreateProject, useUpdateProject } from '../hooks/useProjects';
import { useServices } from '@/features/services/hooks/useServices';
import { ProjectFormData, ProjectPart } from '../types/project.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { useEditForm } from '@/hooks/useEditForm';
import { buildProjectFormData } from '../api/projectsApi';
import { toast } from 'react-hot-toast';

const defaultPartTemplate: ProjectPart = {
  type: 'website',
  title: { ar: 'الموقع الإلكتروني', en: 'Website' },
  description: { ar: '', en: '' },
  website_url: '',
  app_store_url: '',
  google_play_url: '',
  technologies: [],
  apps: [],
  images: [],
  newImageFiles: [],
};

const initialDefaultValues: ProjectFormData = {
  service_id: '',
  slug: '',
  title: { ar: '', en: '' },
  description: { ar: '', en: '' },
  is_featured: false,
  is_active: true,
  sort_order: 1,
  parts: [defaultPartTemplate],
};

export default function ProjectFormPage() {
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
          ? p.parts.map((part) => ({
              type: part.type || 'website',
              title: { ar: part.title?.ar || '', en: part.title?.en || '' },
              description: { ar: part.description?.ar || '', en: part.description?.en || '' },
              website_url: part.website_url || '',
              app_store_url: part.app_store_url || '',
              google_play_url: part.google_play_url || '',
              technologies: part.technologies || [],
              apps: part.apps || [],
              images: part.images || [],
              newImageFiles: [],
            }))
          : [defaultPartTemplate],
    };
  }, [projectRes]);

  const currentCoverUrl = projectRes?.data
    ? getMediaUrl(projectRes.data.cover_image) || getMediaUrl(projectRes.data.image) || null
    : null;

  const {
    form: { register, watch, setValue, formState: { errors } },
    hasChanges,
    handleSubmit,
  } = useEditForm<ProjectFormData>({
    defaultValues: initialDefaultValues,
    data: recordData,
    files: { cover_image: coverFile },
    isEdit,
    onSubmit: (dirtyValues, allValues) => {
      // Validate parts
      const parts = allValues.parts || [];
      if (parts.length === 0) {
        toast.error('يجب إضافة جزء واحد على الأقل للمشروع');
        return;
      }

      if (!isEdit) {
        // Check if every part has at least one image file on create
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!part.newImageFiles || part.newImageFiles.length === 0) {
            toast.error(`يرجى رفع صورة واحدة على الأقل للجزء رقم ${i + 1} (${part.title?.ar || part.type})`);
            return;
          }
        }
      }

      if (isEdit && id) {
        const payload = buildProjectFormData({ ...dirtyValues, parts: allValues.parts, cover_image: coverFile }, true);
        updateProject(payload, {
          onSuccess: () => navigate('/dashboard/projects'),
        });
      } else {
        const payload = buildProjectFormData({ ...allValues, cover_image: coverFile }, false);
        createProject(payload, {
          onSuccess: () => navigate('/dashboard/projects'),
        });
      }
    },
  });

  const parts = watch('parts') || [];

  const handleAddPart = () => {
    if (parts.length >= 6) {
      toast.error('الحد الأقصى لأجزاء المشروع هو 6 أجزاء');
      return;
    }
    const newPart: ProjectPart = {
      type: 'website',
      title: { ar: 'جزء جديد', en: 'New Part' },
      description: { ar: '', en: '' },
      website_url: '',
      app_store_url: '',
      google_play_url: '',
      technologies: [],
      apps: [],
      images: [],
      newImageFiles: [],
    };
    setValue('parts', [...parts, newPart], { shouldDirty: true });
  };

  const handleRemovePart = (index: number) => {
    if (parts.length <= 1) {
      toast.error('يجب أن يحتوي المشروع على جزء واحد على الأقل');
      return;
    }
    const updated = parts.filter((_, i) => i !== index);
    setValue('parts', updated, { shouldDirty: true });
  };

  const handlePartImagesChange = (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const currentPart = parts[index];
    const maxImages = currentPart.type === 'website' ? 1 : 3;
    const existingCount = (currentPart.images?.length || 0);
    const newFiles = Array.from(files);

    if (existingCount + newFiles.length > maxImages) {
      toast.error(`الحد الأقصى لصور ${currentPart.type === 'website' ? 'الموقع' : 'التطبيق'} هو ${maxImages}`);
      return;
    }

    const updated = [...parts];
    updated[index] = {
      ...currentPart,
      newImageFiles: [...(currentPart.newImageFiles || []), ...newFiles],
    };
    setValue('parts', updated, { shouldDirty: true });
  };

  const handleRemoveExistingImage = (partIndex: number, imgIndex: number) => {
    const updated = [...parts];
    const currentPart = updated[partIndex];
    if (currentPart.images) {
      currentPart.images = currentPart.images.filter((_, i) => i !== imgIndex);
      setValue('parts', updated, { shouldDirty: true });
    }
  };

  const handleRemoveNewImage = (partIndex: number, fileIndex: number) => {
    const updated = [...parts];
    const currentPart = updated[partIndex];
    if (currentPart.newImageFiles) {
      currentPart.newImageFiles = currentPart.newImageFiles.filter((_, i) => i !== fileIndex);
      setValue('parts', updated, { shouldDirty: true });
    }
  };

  if (isEdit && projectLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل تفاصيل المشروع...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard/projects')}
          className="rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <PageHeader
          title={isEdit ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
          description="أدخل تفاصيل المشروع وأجزائه (موقع ويب / تطبيق هاتف) مع الصور والتقنيات"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Core Info */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                الخدمة التابعة <span className="text-destructive">*</span>
              </label>
              <select
                {...register('service_id', { required: 'يرجى اختيار الخدمة التابعة' })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">اختر الخدمة...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title?.ar || s.title?.en}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <p className="text-xs text-destructive">{errors.service_id.message}</p>
              )}
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
                placeholder="مثال: my-project"
                {...register('slug', { required: !isEdit ? 'الرابط الدائم مطلوب' : false })}
                className={`w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  isEdit ? 'opacity-60 cursor-not-allowed bg-muted/30' : ''
                }`}
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
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
            label="وصف المشروع"
            nameAr="description.ar"
            nameEn="description.en"
            register={register}
            errorAr={errors.description?.ar?.message}
            errorEn={errors.description?.en?.message}
            isTextarea
            rows={4}
            required
          />

          <ImageUploadPreview
            label="صورة غلاف المشروع الرئيسية (Cover Image)"
            currentImageUrl={currentCoverUrl}
            onChange={setCoverFile}
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

        {/* Project Parts Section */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">أجزاء المشروع (Parts)</h3>
                <p className="text-xs text-muted-foreground">
                  أضف أجزاء المشروع (موقع إلكتروني أو تطبيق هاتف) مع الروابط والصور الخاصة بكل جزء
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPart}
              className="rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة جزء</span>
            </Button>
          </div>

          <div className="space-y-6">
            {parts.map((part, pIdx) => {
              const isWebsite = part.type === 'website';
              return (
                <div
                  key={pIdx}
                  className="p-5 border rounded-2xl bg-muted/20 relative space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {pIdx + 1}
                      </span>
                      <span className="font-bold text-sm text-foreground">
                        {isWebsite ? 'موقع إلكتروني (Website)' : 'تطبيق هاتف (Mobile App)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={part.type}
                        onChange={(e) => {
                          const updated = [...parts];
                          updated[pIdx].type = e.target.value as 'website' | 'mobile_app';
                          setValue('parts', updated, { shouldDirty: true });
                        }}
                        className="h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium"
                      >
                        <option value="website">موقع ويب</option>
                        <option value="mobile_app">تطبيق جوال</option>
                      </select>

                      {parts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePart(pIdx)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">عنوان الجزء (عربي)</label>
                      <input
                        type="text"
                        value={part.title?.ar || ''}
                        onChange={(e) => {
                          const updated = [...parts];
                          updated[pIdx].title.ar = e.target.value;
                          setValue('parts', updated, { shouldDirty: true });
                        }}
                        placeholder="مثال: الموقع الإلكتروني"
                        className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">عنوان الجزء (إنجليزي)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={part.title?.en || ''}
                        onChange={(e) => {
                          const updated = [...parts];
                          updated[pIdx].title.en = e.target.value;
                          setValue('parts', updated, { shouldDirty: true });
                        }}
                        placeholder="e.g. Web Platform"
                        className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                      />
                    </div>
                  </div>

                  {/* Part Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">وصف الجزء (عربي - اختياري)</label>
                      <textarea
                        rows={2}
                        value={part.description?.ar || ''}
                        onChange={(e) => {
                          const updated = [...parts];
                          if (!updated[pIdx].description) updated[pIdx].description = { ar: '', en: '' };
                          updated[pIdx].description!.ar = e.target.value;
                          setValue('parts', updated, { shouldDirty: true });
                        }}
                        placeholder="وصف مختصر لهذا الجزء..."
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">وصف الجزء (إنجليزي - اختياري)</label>
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={part.description?.en || ''}
                        onChange={(e) => {
                          const updated = [...parts];
                          if (!updated[pIdx].description) updated[pIdx].description = { ar: '', en: '' };
                          updated[pIdx].description!.en = e.target.value;
                          setValue('parts', updated, { shouldDirty: true });
                        }}
                        placeholder="Part description in English..."
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* URLs depending on type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {isWebsite ? (
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-primary" />
                          <span>رابط الموقع (Website URL)</span>
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={part.website_url || ''}
                          onChange={(e) => {
                            const updated = [...parts];
                            updated[pIdx].website_url = e.target.value;
                            setValue('parts', updated, { shouldDirty: true });
                          }}
                          placeholder="https://example.com"
                          className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                            <span>رابط App Store</span>
                          </label>
                          <input
                            type="url"
                            dir="ltr"
                            value={part.app_store_url || ''}
                            onChange={(e) => {
                              const updated = [...parts];
                              updated[pIdx].app_store_url = e.target.value;
                              setValue('parts', updated, { shouldDirty: true });
                            }}
                            placeholder="https://apps.apple.com/..."
                            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                            <span>رابط Google Play</span>
                          </label>
                          <input
                            type="url"
                            dir="ltr"
                            value={part.google_play_url || ''}
                            onChange={(e) => {
                              const updated = [...parts];
                              updated[pIdx].google_play_url = e.target.value;
                              setValue('parts', updated, { shouldDirty: true });
                            }}
                            placeholder="https://play.google.com/..."
                            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">رابط الويب إن وجد</label>
                          <input
                            type="url"
                            dir="ltr"
                            value={part.website_url || ''}
                            onChange={(e) => {
                              const updated = [...parts];
                              updated[pIdx].website_url = e.target.value;
                              setValue('parts', updated, { shouldDirty: true });
                            }}
                            placeholder="https://example.com"
                            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Technologies tag input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      التقنيات المستخدمة (افصل بينها بفاصلة أو اضغط Enter)
                    </label>
                    <input
                      type="text"
                      placeholder="React, Laravel, Tailwind, Flutter..."
                      value={part.technologies?.join(', ') || ''}
                      onChange={(e) => {
                        const updated = [...parts];
                        const list = e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updated[pIdx].technologies = list;
                        setValue('parts', updated, { shouldDirty: true });
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                    />
                  </div>

                  {/* Sub-Apps Builder (for mobile_app type) */}
                  {!isWebsite && (
                    <div className="p-3.5 bg-background border rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">التطبيقات الفرعية (Apps - مثال: تطبيق العميل، تطبيق السائق)</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = [...parts];
                            if (!updated[pIdx].apps) updated[pIdx].apps = [];
                            updated[pIdx].apps!.push({
                              title: { ar: '', en: '' },
                              description: { ar: '', en: '' },
                            });
                            setValue('parts', updated, { shouldDirty: true });
                          }}
                          className="h-7 text-xs rounded-lg flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>إضافة تطبيق</span>
                        </Button>
                      </div>

                      {part.apps?.map((app, appIdx) => (
                        <div key={appIdx} className="p-2.5 border rounded-lg bg-muted/10 space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-muted-foreground">تطبيق #{appIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...parts];
                                updated[pIdx].apps = updated[pIdx].apps!.filter((_, i) => i !== appIdx);
                                setValue('parts', updated, { shouldDirty: true });
                              }}
                              className="text-destructive hover:bg-destructive/10 p-1 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={app.title?.ar || ''}
                              onChange={(e) => {
                                const updated = [...parts];
                                updated[pIdx].apps![appIdx].title.ar = e.target.value;
                                setValue('parts', updated, { shouldDirty: true });
                              }}
                              placeholder="اسم التطبيق (عربي) *"
                              className="h-8 px-2.5 rounded-lg border text-xs"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={app.title?.en || ''}
                              onChange={(e) => {
                                const updated = [...parts];
                                updated[pIdx].apps![appIdx].title.en = e.target.value;
                                setValue('parts', updated, { shouldDirty: true });
                              }}
                              placeholder="App Title (EN) *"
                              className="h-8 px-2.5 rounded-lg border text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Part Images Gallery & Uploader */}
                  <div className="space-y-2 pt-2 border-t">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>صور هذا الجزء (حد أقصى {isWebsite ? 'صورة 1 للموقع' : '3 صور للتطبيق'})</span>
                      <span className="text-[11px] text-muted-foreground">
                        {((part.images?.length || 0) + (part.newImageFiles?.length || 0))} من {isWebsite ? 1 : 3}
                      </span>
                    </label>

                    {/* Previews */}
                    <div className="flex flex-wrap gap-3">
                      {/* Existing server images */}
                      {part.images?.map((img, iIdx) => {
                        const url = typeof img === 'object' && img && 'url' in img ? img.url : '';
                        return (
                          <div key={`exist-${iIdx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border group">
                            <img src={getMediaUrl(url) || ''} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(pIdx, iIdx)}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Newly selected files */}
                      {part.newImageFiles?.map((file, fIdx) => (
                        <div key={`new-${fIdx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-primary/50 group">
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                          <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(pIdx, fIdx)}
                            className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      ))}

                      {/* File input button */}
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <UploadCloud className="w-5 h-5 mb-1" />
                        <span className="text-[10px]">رفع صورة</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple={!isWebsite}
                          className="hidden"
                          onChange={(e) => handlePartImagesChange(pIdx, e.target.files)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/projects')}
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
            <span>{isEdit ? 'تحديث المشروع' : 'حفظ المشروع'}</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
