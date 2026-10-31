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
    <div className={cn('space-y-1.5', className)}>
      {label && <label className="text-sm font-semibold text-foreground">{label}</label>}

      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center p-4',
          preview
            ? 'border-border bg-card'
            : 'border-border/80 hover:border-primary/50 hover:bg-muted/30 bg-muted/10',
          aspectClasses[aspectRatio],
          error && 'border-destructive'
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
              className="absolute top-2 left-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-destructive transition-colors shadow-sm"
              title="إزالة الصورة"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">اضغط لرفع صورة</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP حتى 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
