import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceFeature } from '../types/service.types';

interface ServiceFeaturesSectionProps {
  features: ServiceFeature[];
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onUpdateFeatureTitle: (index: number, lang: 'ar' | 'en', value: string) => void;
}

export function ServiceFeaturesSection({
  features,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeatureTitle,
}: ServiceFeaturesSectionProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="font-bold text-foreground">ميزات الخدمة (Features)</h3>
          <p className="text-xs text-muted-foreground">
            أضف النقاط والمزايا البارزة المشمولة بهذه الخدمة
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddFeature}
          className="rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ميزة</span>
        </Button>
      </div>

      {features.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
          لم تتم إضافة أي ميزات بعد. اضغط "إضافة ميزة" للبدء.
        </div>
      ) : (
        <div className="space-y-4">
          {features.map((feat, fIdx) => (
            <div
              key={fIdx}
              className="p-4 border rounded-xl bg-muted/20 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  ميزة #{fIdx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFeature(fIdx)}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  value={feat.title?.ar || ''}
                  onChange={(e) =>
                    onUpdateFeatureTitle(fIdx, 'ar', e.target.value)
                  }
                  placeholder="عنوان الميزة (عربي) *"
                />
                <Input
                  type="text"
                  dir="ltr"
                  value={feat.title?.en || ''}
                  onChange={(e) =>
                    onUpdateFeatureTitle(fIdx, 'en', e.target.value)
                  }
                  placeholder="Feature Title (EN)"
                  className="font-sans"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceFeaturesSection;
