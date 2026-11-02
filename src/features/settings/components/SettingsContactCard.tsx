import { Phone } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { FormInput } from '@/components/shared/forms/FormInput';
import { SiteSettings } from '../types/settings.types';

interface SettingsContactCardProps {
  register: UseFormRegister<SiteSettings>;
}

export function SettingsContactCard({ register }: SettingsContactCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">معلومات الاتصال</h3>
          <p className="text-xs text-muted-foreground">
            أرقام الهواتف والواتساب والبريد الرسمي
          </p>
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
  );
}

export default SettingsContactCard;
