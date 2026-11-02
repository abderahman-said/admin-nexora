import { useMemo } from 'react';
import { Save } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { SiteSettings } from '../types/settings.types';
import PageHeader from '@/components/shared/PageHeader';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { useEditForm } from '@/hooks/useEditForm';
import { SettingsContactCard } from '../components/SettingsContactCard';
import { SettingsSocialCard } from '../components/SettingsSocialCard';
import { SettingsFooterCard } from '../components/SettingsFooterCard';

const initialDefaultValues: SiteSettings = {
  phone: '',
  whatsapp: '',
  email: '',
  facebook_url: '',
  linkedin_url: '',
  instagram_url: '',
  footer_description: { ar: '', en: '' },
};

export default function SettingsPage() {
  const { data: res, isLoading } = useSettings();
  const { mutate: updateSettings, isPending: updating } = useUpdateSettings();

  const settings = res?.data;

  const recordData = useMemo<SiteSettings | null>(() => {
    if (!settings) return null;
    return {
      phone: settings.phone || '',
      whatsapp: settings.whatsapp || '',
      email: settings.email || '',
      facebook_url: settings.facebook_url || '',
      linkedin_url: settings.linkedin_url || '',
      instagram_url: settings.instagram_url || '',
      footer_description: {
        ar: settings.footer_description?.ar || '',
        en: settings.footer_description?.en || '',
      },
    };
  }, [settings]);

  const {
    form: { register },
    hasChanges,
    handleSubmit,
    resetWithData,
  } = useEditForm<SiteSettings>({
    defaultValues: initialDefaultValues,
    data: recordData,
    isEdit: true,
    onSubmit: (dirtyValues, allValues) => {
      // Send ONLY changed fields in the PATCH request
      updateSettings(dirtyValues, {
        onSuccess: () => {
          resetWithData(allValues);
        },
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل إعدادات الموقع...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="إعدادات الموقع"
        description="إدارة معلومات الاتصال، وسائل التواصل الاجتماعي، وتذييل الموقع"
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <SettingsContactCard register={register} />
        <SettingsSocialCard register={register} />
        <SettingsFooterCard register={register} />

        <div className="flex justify-end pt-2">
          <LoadingButton
            type="submit"
            loading={updating}
            disabled={!hasChanges || updating}
            loadingText="جاري الحفظ..."
            className="rounded-xl px-8 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
