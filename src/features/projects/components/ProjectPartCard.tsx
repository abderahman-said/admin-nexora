import { Trash2, Globe, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FormSelect from '@/components/shared/forms/FormSelect';
import { TechnologiesEditor } from './TechnologiesEditor';
import { ProjectSubAppsEditor } from './ProjectSubAppsEditor';
import { ProjectPartImagesUploader } from './ProjectPartImagesUploader';
import { ProjectPart } from '../types/project.types';

interface ProjectPartCardProps {
  part: ProjectPart;
  pIdx: number;
  totalParts: number;
  onPartTypeChange: (pIdx: number, newType: 'website' | 'mobile_app') => void;
  onRemovePart: (pIdx: number) => void;
  onUpdateField: <K extends keyof ProjectPart>(
    pIdx: number,
    field: K,
    val: ProjectPart[K]
  ) => void;
  onUploadImages: (pIdx: number, files: FileList | null) => void;
  onRemoveExistingImage: (pIdx: number, imgIndex: number) => void;
  onRemoveNewImage: (pIdx: number, fileIndex: number) => void;
  onUpdateSubApp: (
    pIdx: number,
    appIdx: number,
    field: 'title' | 'description',
    lang: 'ar' | 'en',
    val: string
  ) => void;
  onAddSubApp: (pIdx: number) => void;
  onRemoveSubApp: (pIdx: number, appIdx: number) => void;
}

export function ProjectPartCard({
  part,
  pIdx,
  totalParts,
  onPartTypeChange,
  onRemovePart,
  onUpdateField,
  onUploadImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  onUpdateSubApp,
  onAddSubApp,
  onRemoveSubApp,
}: ProjectPartCardProps) {
  const isWebsite = part.type === 'website';

  return (
    <div className="p-5 border rounded-2xl bg-muted/20 relative space-y-4 hover:border-primary/40 transition-colors">
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
          <div className="w-32">
            <FormSelect
              value={part.type}
              onChange={(val) => onPartTypeChange(pIdx, val as 'website' | 'mobile_app')}
              options={[
                { value: 'website', label: 'موقع ويب' },
                { value: 'mobile_app', label: 'تطبيق جوال' },
              ]}
              triggerClassName="h-8.5 rounded-lg text-xs"
            />
          </div>

          {totalParts > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemovePart(pIdx)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="حذف هذا الجزء"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Part Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">عنوان الجزء (عربي)</label>
          <Input
            type="text"
            value={part.title?.ar || ''}
            onChange={(e) =>
              onUpdateField(pIdx, 'title', {
                ar: e.target.value,
                en: part.title?.en || '',
              })
            }
            placeholder="مثال: الموقع الإلكتروني"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">عنوان الجزء (إنجليزي)</label>
          <Input
            type="text"
            dir="ltr"
            value={part.title?.en || ''}
            onChange={(e) =>
              onUpdateField(pIdx, 'title', {
                ar: part.title?.ar || '',
                en: e.target.value,
              })
            }
            placeholder="e.g. Web Platform"
            className="font-sans"
          />
        </div>
      </div>

      {/* Part Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-1.5">
          <div className="h-5 flex items-center">
            <label className="text-xs font-semibold text-foreground">وصف الجزء (عربي - اختياري)</label>
          </div>
          <Textarea
            rows={2}
            value={part.description?.ar || ''}
            onChange={(e) =>
              onUpdateField(pIdx, 'description', {
                ar: e.target.value,
                en: part.description?.en || '',
              })
            }
            placeholder="وصف مختصر لهذا الجزء..."
            className="resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <div className="h-5 flex items-center">
            <label className="text-xs font-semibold text-foreground">وصف الجزء (إنجليزي - اختياري)</label>
          </div>
          <Textarea
            rows={2}
            dir="ltr"
            value={part.description?.en || ''}
            onChange={(e) =>
              onUpdateField(pIdx, 'description', {
                ar: part.description?.ar || '',
                en: e.target.value,
              })
            }
            placeholder="Part description in English..."
            className="resize-none font-sans"
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
            <Input
              type="url"
              dir="ltr"
              value={part.website_url || ''}
              onChange={(e) => onUpdateField(pIdx, 'website_url', e.target.value)}
              placeholder="https://example.com"
              className="font-sans"
            />
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                <span>رابط App Store</span>
              </label>
              <Input
                type="url"
                dir="ltr"
                value={part.app_store_url || ''}
                onChange={(e) => onUpdateField(pIdx, 'app_store_url', e.target.value)}
                placeholder="https://apps.apple.com/..."
                className="font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                <span>رابط Google Play</span>
              </label>
              <Input
                type="url"
                dir="ltr"
                value={part.google_play_url || ''}
                onChange={(e) => onUpdateField(pIdx, 'google_play_url', e.target.value)}
                placeholder="https://play.google.com/..."
                className="font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">رابط الويب إن وجد</label>
              <Input
                type="url"
                dir="ltr"
                value={part.website_url || ''}
                onChange={(e) => onUpdateField(pIdx, 'website_url', e.target.value)}
                placeholder="https://example.com"
                className="font-sans"
              />
            </div>
          </>
        )}
      </div>

      {/* Technologies tag editor */}
      <TechnologiesEditor
        technologies={part.technologies || []}
        onChange={(newTechs) => onUpdateField(pIdx, 'technologies', newTechs)}
      />

      {/* Sub-Apps Builder (for mobile_app type) */}
      {!isWebsite && (
        <ProjectSubAppsEditor
          apps={part.apps || []}
          onAddApp={() => onAddSubApp(pIdx)}
          onRemoveApp={(appIdx) => onRemoveSubApp(pIdx, appIdx)}
          onUpdateApp={(appIdx, field, lang, val) =>
            onUpdateSubApp(pIdx, appIdx, field, lang, val)
          }
        />
      )}

      {/* Part Images Gallery & Uploader */}
      <ProjectPartImagesUploader
        partType={part.type}
        images={part.images || []}
        newImageFiles={part.newImageFiles || []}
        onUploadFiles={(files) => onUploadImages(pIdx, files)}
        onRemoveExisting={(imgIndex) => onRemoveExistingImage(pIdx, imgIndex)}
        onRemoveNew={(fileIndex) => onRemoveNewImage(pIdx, fileIndex)}
      />
    </div>
  );
}

export default ProjectPartCard;
