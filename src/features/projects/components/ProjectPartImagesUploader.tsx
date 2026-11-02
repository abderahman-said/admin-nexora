import { UploadCloud, CheckCircle2, Trash2 } from 'lucide-react';
import { cn, getMediaUrl } from '@/lib/utils';
import { ProjectPartImage } from '../types/project.types';

interface ProjectPartImagesUploaderProps {
  partType: 'website' | 'mobile_app';
  images?: Array<ProjectPartImage | string | number>;
  newImageFiles?: File[];
  onUploadFiles: (files: FileList | null) => void;
  onRemoveExisting: (imgIndex: number) => void;
  onRemoveNew: (fileIndex: number) => void;
}

export function ProjectPartImagesUploader({
  partType,
  images = [],
  newImageFiles = [],
  onUploadFiles,
  onRemoveExisting,
  onRemoveNew,
}: ProjectPartImagesUploaderProps) {
  const isWebsite = partType === 'website';
  const maxImages = isWebsite ? 1 : 3;
  const totalCount = images.length + newImageFiles.length;

  return (
    <div className="space-y-2 pt-2 border-t">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <span>صور هذا الجزء ({isWebsite ? 'صورة 1 للموقع' : 'حتى 3 صور للتطبيق'})</span>
            <span className="text-destructive font-bold text-sm" title="مطلوب">*</span>
          </label>
          <p className="text-[11px] text-muted-foreground pt-1">
            {isWebsite
              ? 'لقطة شاشة لواجهة الموقع (مطلوبة - صورة واحدة)'
              : 'لقطات شاشة لواجهات التطبيق (مطلوبة - من 1 إلى 3 صور)'}
          </p>
        </div>
        <span
          className={cn(
            'text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors',
            totalCount === 0
              ? 'bg-destructive/10 text-destructive border border-destructive/20 font-semibold'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {totalCount} من {maxImages}
          {totalCount === 0 && ' (مطلوب)'}
        </span>
      </div>

      {/* Previews & Uploader */}
      <div className="flex flex-wrap gap-3">
        {/* Existing server images */}
        {images.map((img, iIdx) => {
          const url =
            typeof img === 'object' && img && 'url' in img
              ? img.url
              : typeof img === 'string'
              ? img
              : '';
          return (
            <div
              key={`exist-${iIdx}`}
              className="relative w-20 h-20 rounded-xl overflow-hidden border group"
            >
              <img
                src={getMediaUrl(url) || ''}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(iIdx)}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="حذف الصورة"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          );
        })}

        {/* Newly selected files */}
        {newImageFiles.map((file, fIdx) => (
          <div
            key={`new-${fIdx}`}
            className="relative w-20 h-20 rounded-xl overflow-hidden border border-primary/50 group"
          >
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <button
              type="button"
              onClick={() => onRemoveNew(fIdx)}
              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="إلغاء الصورة الجديدة"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}

        {/* File input button */}
        <label
          className={cn(
            'w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors',
            totalCount === 0
              ? 'border-destructive/40 hover:border-destructive text-destructive bg-destructive/5'
              : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
          )}
        >
          <UploadCloud className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">
            {totalCount === 0 ? 'رفع صورة *' : 'رفع صورة'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple={!isWebsite}
            className="hidden"
            onChange={(e) => onUploadFiles(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}

export default ProjectPartImagesUploader;
