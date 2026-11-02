import { ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { ProjectBasicInfoSection } from '../components/ProjectBasicInfoSection';
import { ProjectPartsSection } from '../components/ProjectPartsSection';
import { useProjectForm } from '../hooks/useProjectForm';

export default function ProjectFormPage() {
  const {
    isEdit,
    projectLoading,
    services,
    currentCoverUrl,
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
  } = useProjectForm();

  if (isEdit && projectLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل تفاصيل المشروع...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
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
          description="أدخل تفاصيل المشروع وأجزائه (موقع ويب / تطبيق هاتف) مع الروابط والصور والتقنيات"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <ProjectBasicInfoSection
          isEdit={isEdit}
          services={services}
          currentCoverUrl={currentCoverUrl}
          onCoverFileChange={setCoverFile}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        <ProjectPartsSection
          parts={parts}
          onAddPart={handleAddPart}
          onPartTypeChange={handlePartTypeChange}
          onRemovePart={handleRemovePart}
          onUpdateField={updatePartField}
          onUploadImages={handlePartImagesChange}
          onRemoveExistingImage={handleRemoveExistingImage}
          onRemoveNewImage={handleRemoveNewImage}
          onUpdateSubApp={updateSubApp}
          onAddSubApp={handleAddSubApp}
          onRemoveSubApp={handleRemoveSubApp}
        />

        {/* Sticky Submit Bar */}
        <div className="sticky bottom-4 z-20 bg-card/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-elevated flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {isEdit
              ? hasChanges
                ? 'لديك تعديلات غير محفوظة'
                : 'لم يتم إجراء أي تغييرات بعد'
              : 'تأكد من تعبئة الحقول المطلوبة قبل الحفظ'}
          </div>

          <div className="flex items-center gap-2.5 ms-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/projects')}
              className="rounded-xl px-5 text-xs shadow-2xs"
            >
              إلغاء
            </Button>

            <LoadingButton
              type="submit"
              loading={isSaving}
              disabled={(isEdit && !hasChanges) || isSaving}
              loadingText="جاري الحفظ..."
              className="rounded-xl px-7 text-xs flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'تحديث المشروع' : 'حفظ المشروع'}</span>
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
}
