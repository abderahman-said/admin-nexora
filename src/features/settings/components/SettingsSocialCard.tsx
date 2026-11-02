import { Share2 } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { FormInput } from '@/components/shared/forms/FormInput';
import { SiteSettings } from '../types/settings.types';

interface SettingsSocialCardProps {
  register: UseFormRegister<SiteSettings>;
}

export function SettingsSocialCard({ register }: SettingsSocialCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">روابط التواصل الاجتماعي</h3>
          <p className="text-xs text-muted-foreground">
            حسابات الشركة على المنصات الرقمية
          </p>
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
  );
}

export default SettingsSocialCard;
