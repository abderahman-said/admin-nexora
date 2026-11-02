import { ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { ServiceBasicInfoSection } from '../components/ServiceBasicInfoSection';
import { ServiceFeaturesSection } from '../components/ServiceFeaturesSection';
import { useServiceForm } from '../hooks/useServiceForm';

export default function ServiceFormPage() {
  const {
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
  } = useServiceForm();

  if (isEdit && serviceLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل بيانات الخدمة...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard/services')}
          className="rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <PageHeader
          title={isEdit ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
          description="أدخل تفاصيل ومواصفات الخدمة، الأيقونة والميزات بالعربية والإنجليزية"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <ServiceBasicInfoSection
          isEdit={isEdit}
          currentIconUrl={currentIconUrl}
          onIconFileChange={setIconFile}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        <ServiceFeaturesSection
          features={features}
          onAddFeature={handleAddFeature}
          onRemoveFeature={handleRemoveFeature}
          onUpdateFeatureTitle={handleUpdateFeatureTitle}
        />

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/services')}
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
            <span>{isEdit ? 'تحديث الخدمة' : 'حفظ الخدمة'}</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
