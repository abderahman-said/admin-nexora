import { useMemo } from 'react';
import { Save, Phone, Globe, Share2 } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { SiteSettings } from '../types/settings.types';
import PageHeader from '@/components/shared/PageHeader';
import TranslatableInput from '@/components/shared/TranslatableInput';
import { FormInput } from '@/components/shared/forms/FormInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { useEditForm } from '@/hooks/useEditForm';

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
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <PageHeader
        title="إعدادات الموقع"
        description="إدارة معلومات الاتصال، وسائل التواصل الاجتماعي، وتذييل الموقع"
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Contact Info Card */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">معلومات الاتصال</h3>
              <p className="text-xs text-muted-foreground">أرقام الهواتف والواتساب والبريد الرسمي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              name="phone"
              label="رقم الهاتف"
              placeholder="+201001234567"
              register={register}
            />

            <FormInput
              name="whatsapp"
              label="رقم الواتساب"
              placeholder="+201001234568"
              register={register}
            />

            <FormInput
              name="email"
              type="email"
              label="البريد الإلكتروني الرسمي"
              placeholder="info@nexora.com"
              register={register}
            />
          </div>
        </div>

        {/* Social Media Links Card */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">روابط التواصل الاجتماعي</h3>
              <p className="text-xs text-muted-foreground">حسابات الشركة على المنصات الرقمية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              name="facebook_url"
              label="رابط فيسبوك"
              placeholder="https://facebook.com/..."
              register={register}
            />

            <FormInput
              name="linkedin_url"
              label="رابط لينكد إن"
              placeholder="https://linkedin.com/in/..."
              register={register}
            />

            <FormInput
              name="instagram_url"
              label="رابط إنستغرام"
              placeholder="https://instagram.com/..."
              register={register}
            />
          </div>
        </div>

        {/* Footer & General Card */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">وصف الموقع والتذييل</h3>
              <p className="text-xs text-muted-foreground">النص التعريفي الذي يظهر في الفوتر</p>
            </div>
          </div>

          <TranslatableInput
            label="وصف تذييل الموقع (Footer Description)"
            nameAr="footer_description.ar"
            nameEn="footer_description.en"
            register={register}
            isTextarea
            rows={3}
          />
        </div>

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
