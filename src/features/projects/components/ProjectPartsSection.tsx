import { Layers, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectPart } from '../types/project.types';
import { ProjectPartCard } from './ProjectPartCard';

interface ProjectPartsSectionProps {
  parts: ProjectPart[];
  onAddPart: () => void;
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

export function ProjectPartsSection({
  parts,
  onAddPart,
  onPartTypeChange,
  onRemovePart,
  onUpdateField,
  onUploadImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  onUpdateSubApp,
  onAddSubApp,
  onRemoveSubApp,
}: ProjectPartsSectionProps) {
  return (
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
          onClick={onAddPart}
          className="rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة جزء</span>
        </Button>
      </div>

      <div className="space-y-6">
        {parts.map((part, pIdx) => (
          <ProjectPartCard
            key={`part-${pIdx}-${part.type}`}
            part={part}
            pIdx={pIdx}
            totalParts={parts.length}
            onPartTypeChange={onPartTypeChange}
            onRemovePart={onRemovePart}
            onUpdateField={onUpdateField}
            onUploadImages={onUploadImages}
            onRemoveExistingImage={onRemoveExistingImage}
            onRemoveNewImage={onRemoveNewImage}
            onUpdateSubApp={onUpdateSubApp}
            onAddSubApp={onAddSubApp}
            onRemoveSubApp={onRemoveSubApp}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectPartsSection;
