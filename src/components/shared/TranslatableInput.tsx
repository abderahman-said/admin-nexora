import { useState } from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface TranslatableInputProps<T extends FieldValues> {
  label: string;
  nameAr: Path<T>;
  nameEn: Path<T>;
  register: UseFormRegister<T>;
  errorAr?: string;
  errorEn?: string;
  isTextarea?: boolean;
  rows?: number;
  placeholderAr?: string;
  placeholderEn?: string;
  required?: boolean;
}

export default function TranslatableInput<T extends FieldValues>({
  label,
  nameAr,
  nameEn,
  register,
  errorAr,
  errorEn,
  isTextarea = false,
  rows = 3,
  placeholderAr = 'باللغة العربية...',
  placeholderEn = 'In English...',
  required = false,
}: TranslatableInputProps<T>) {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');

  const hasErrorAr = Boolean(errorAr);
  const hasErrorEn = Boolean(errorEn);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>

        {/* Language Tabs */}
        <div className="flex items-center bg-muted p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('ar')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-all',
              activeTab === 'ar'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground',
              hasErrorAr && 'text-destructive font-bold'
            )}
          >
            العربية {hasErrorAr && '•'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-all',
              activeTab === 'en'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground',
              hasErrorEn && 'text-destructive font-bold'
            )}
          >
            English {hasErrorEn && '•'}
          </button>
        </div>
      </div>

      {/* Input / Textarea rendering */}
      <div className={activeTab === 'ar' ? 'block' : 'hidden'}>
        {isTextarea ? (
          <textarea
            rows={rows}
            dir="rtl"
            placeholder={placeholderAr}
            {...register(nameAr, { required: required ? 'الحقل بالعربية مطلوب' : false })}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all',
              hasErrorAr ? 'border-destructive focus:ring-destructive/30' : 'border-border'
            )}
          />
        ) : (
          <input
            type="text"
            dir="rtl"
            placeholder={placeholderAr}
            {...register(nameAr, { required: required ? 'الحقل بالعربية مطلوب' : false })}
            className={cn(
              'w-full h-11 px-4 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all',
              hasErrorAr ? 'border-destructive focus:ring-destructive/30' : 'border-border'
            )}
          />
        )}
        {errorAr && <p className="text-xs text-destructive mt-1">{errorAr}</p>}
      </div>

      <div className={activeTab === 'en' ? 'block' : 'hidden'}>
        {isTextarea ? (
          <textarea
            rows={rows}
            dir="ltr"
            placeholder={placeholderEn}
            {...register(nameEn, { required: required ? 'English field is required' : false })}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all',
              hasErrorEn ? 'border-destructive focus:ring-destructive/30' : 'border-border'
            )}
          />
        ) : (
          <input
            type="text"
            dir="ltr"
            placeholder={placeholderEn}
            {...register(nameEn, { required: required ? 'English field is required' : false })}
            className={cn(
              'w-full h-11 px-4 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all',
              hasErrorEn ? 'border-destructive focus:ring-destructive/30' : 'border-border'
            )}
          />
        )}
        {errorEn && <p className="text-xs text-destructive mt-1">{errorEn}</p>}
      </div>
    </div>
  );
}
