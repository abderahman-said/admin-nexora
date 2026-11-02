import { useState, useEffect, useRef } from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
  const prevErrorsRef = useRef<{ ar?: string; en?: string }>({ ar: errorAr, en: errorEn });

  const hasErrorAr = Boolean(errorAr);
  const hasErrorEn = Boolean(errorEn);

  // 1. Auto-switch tab if an error is detected on the other tab upon validation
  useEffect(() => {
    const prev = prevErrorsRef.current;
    if (errorEn && !errorAr && !prev.en) {
      setActiveTab('en');
    } else if (errorAr && !errorEn && !prev.ar) {
      setActiveTab('ar');
    }
    prevErrorsRef.current = { ar: errorAr, en: errorEn };
  }, [errorAr, errorEn]);

  // 2. Global event listener for form error focus/switch
  useEffect(() => {
    const handleFieldError = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string }>;
      const targetName = customEvent.detail?.name;
      if (targetName === nameAr) {
        setActiveTab('ar');
      } else if (targetName === nameEn) {
        setActiveTab('en');
      }
    };

    window.addEventListener('translatable-field-error', handleFieldError);
    return () => {
      window.removeEventListener('translatable-field-error', handleFieldError);
    };
  }, [nameAr, nameEn]);

  const requiredMessageAr = required ? `يرجى إدخال ${label} باللغة العربية` : false;
  const requiredMessageEn = required ? `يرجى إدخال ${label} باللغة الإنجليزية` : false;

  return (
    <div
      data-translatable-container
      data-field-name-ar={nameAr}
      data-field-name-en={nameEn}
      className="space-y-1.5"
    >
      <div className="h-5 flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-danger">*</span>}
        </label>

        {/* Language Segmented Control */}
        <div className="flex items-center bg-muted/60 p-0.5 rounded-lg text-xs font-medium border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab('ar')}
            className={cn(
              'px-2.5 py-0.5 rounded-md transition-all text-xs flex items-center gap-1.5 cursor-pointer',
              activeTab === 'ar'
                ? 'bg-card text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
              hasErrorAr && 'text-danger font-bold bg-danger/10'
            )}
          >
            <span>العربية</span>
            {hasErrorAr && (
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" title="يوجد خطأ في هذا الحقل" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={cn(
              'px-2.5 py-0.5 rounded-md transition-all text-xs font-sans flex items-center gap-1.5 cursor-pointer',
              activeTab === 'en'
                ? 'bg-card text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
              hasErrorEn && 'text-danger font-bold bg-danger/10'
            )}
          >
            <span>English</span>
            {hasErrorEn && (
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" title="يوجد خطأ في هذا الحقل" />
            )}
          </button>
        </div>
      </div>

      {/* Input / Textarea rendering for Arabic */}
      <div className={activeTab === 'ar' ? 'block' : 'hidden'}>
        {isTextarea ? (
          <Textarea
            rows={rows}
            dir="rtl"
            placeholder={placeholderAr}
            error={hasErrorAr}
            {...register(nameAr, { required: requiredMessageAr })}
          />
        ) : (
          <Input
            type="text"
            dir="rtl"
            placeholder={placeholderAr}
            error={hasErrorAr}
            {...register(nameAr, { required: requiredMessageAr })}
          />
        )}
        {errorAr && <p className="text-xs text-danger mt-1 font-medium">{errorAr}</p>}
      </div>

      {/* Input / Textarea rendering for English */}
      <div className={activeTab === 'en' ? 'block' : 'hidden'}>
        {isTextarea ? (
          <Textarea
            rows={rows}
            dir="ltr"
            placeholder={placeholderEn}
            error={hasErrorEn}
            className="font-sans"
            {...register(nameEn, { required: requiredMessageEn })}
          />
        ) : (
          <Input
            type="text"
            dir="ltr"
            placeholder={placeholderEn}
            error={hasErrorEn}
            className="font-sans"
            {...register(nameEn, { required: requiredMessageEn })}
          />
        )}
        {errorEn && <p className="text-xs text-danger mt-1 font-medium">{errorEn}</p>}
      </div>

      {/* Helpful banner if inactive tab has an uncorrected error */}
      {activeTab === 'ar' && hasErrorEn && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger font-medium animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">يوجد خطأ في الحقل باللغة الإنجليزية: {errorEn}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className="shrink-0 mr-2 px-2 py-0.5 rounded bg-danger text-white hover:bg-danger/90 font-semibold cursor-pointer text-[11px] transition-colors"
          >
            الانتقال للإنجليزية
          </button>
        </div>
      )}

      {activeTab === 'en' && hasErrorAr && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger font-medium animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">يوجد خطأ في الحقل باللغة العربية: {errorAr}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('ar')}
            className="shrink-0 ml-2 px-2 py-0.5 rounded bg-danger text-white hover:bg-danger/90 font-semibold cursor-pointer text-[11px] transition-colors"
          >
            الانتقال للعربية
          </button>
        </div>
      )}
    </div>
  );
}
