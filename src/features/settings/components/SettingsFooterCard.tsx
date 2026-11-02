import { Globe } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import TranslatableInput from '@/components/shared/TranslatableInput';
import { SiteSettings } from '../types/settings.types';

interface SettingsFooterCardProps {
  register: UseFormRegister<SiteSettings>;
}

export function SettingsFooterCard({ register }: SettingsFooterCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">وصف الموقع والتذييل</h3>
          <p className="text-xs text-muted-foreground">
            النص التعريفي الذي يظهر في الفوتر
          </p>
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
  );
}

export default SettingsFooterCard;
