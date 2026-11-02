import React, { useRef, useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadPreviewProps {
  label?: string;
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export default function ImageUploadPreview({
  label = 'الصورة',
  currentImageUrl,
  onChange,
  error,
  className,
  aspectRatio = 'video',
}: ImageUploadPreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentImageUrl && !preview) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl, preview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClasses = {
    square: 'aspect-square max-w-[200px]',
    video: 'aspect-video max-w-md',
    banner: 'aspect-[3/1] max-w-xl',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="text-xs block font-semibold text-foreground">{label}</label>}

      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 flex flex-col items-center justify-center p-3',
          preview
            ? 'border-border bg-card'
            : 'border-border hover:border-primary/50 hover:bg-muted/40 bg-muted/20',
          aspectClasses[aspectRatio],
          error && 'border-danger'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2.5 start-2.5 p-1.5 rounded-xl bg-black/60 text-white hover:bg-danger transition-colors shadow-xs"
              title="إزالة الصورة"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center mb-2.5">
              <UploadCloud className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold text-foreground">اضغط لاختيار صورة</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WEBP حتى 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  );
}
