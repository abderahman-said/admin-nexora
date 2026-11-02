import { TranslatableField } from '@/api/types';
import { useLanguageViewStore, LanguageViewMode } from '@/store/useLanguageViewStore';
import { cn } from '@/lib/utils';

export interface BilingualTextProps {
  text?: TranslatableField | string | null;
  ar?: string | null;
  en?: string | null;
  variant?: 'stacked' | 'inline' | 'badge' | 'description';
  mode?: LanguageViewMode;
  className?: string;
  arClassName?: string;
  enClassName?: string;
  fallback?: string;
  truncate?: boolean;
}

/**
 * Extracts normalized Arabic and English strings from either a TranslatableField,
 * raw string, or explicit ar/en props.
 */
function extractTranslations(
  text?: TranslatableField | string | null,
  propAr?: string | null,
  propEn?: string | null
): { ar: string; en: string } {
  let ar = propAr || '';
  let en = propEn || '';

  if (text) {
    if (typeof text === 'object') {
      ar = ar || text.ar || '';
      en = en || text.en || '';
    } else if (typeof text === 'string') {
      ar = ar || text;
    }
  }

  return { ar: ar.trim(), en: en.trim() };
}

export default function BilingualText({
  text,
  ar: propAr,
  en: propEn,
  variant = 'stacked',
  mode: propMode,
  className,
  arClassName,
  enClassName,
  fallback = '—',
  truncate = false,
}: BilingualTextProps) {
  const globalMode = useLanguageViewStore((state) => state.mode);
  const activeMode = propMode || globalMode;

  const { ar, en } = extractTranslations(text, propAr, propEn);

  if (!ar && !en) {
    return <span className={cn('text-muted-foreground/60 text-xs', className)}>{fallback}</span>;
  }

  // Single language view modes
  if (activeMode === 'ar') {
    const displayText = ar || en;
    return (
      <span className={cn('text-foreground font-medium', arClassName, className)} dir="rtl">
        {displayText}
      </span>
    );
  }

  if (activeMode === 'en') {
    const displayText = en || ar;
    return (
      <span className={cn('text-foreground font-sans font-medium', enClassName, className)} dir="ltr">
        {displayText}
      </span>
    );
  }

  // Active Mode is 'both' (Dual language view)
  if (variant === 'inline') {
    return (
      <div className={cn('inline-flex items-center gap-1.5 flex-wrap', className)}>
        {ar && <span className={cn('font-medium text-foreground', arClassName)} dir="rtl">{ar}</span>}
        {en && (
          <span
            className={cn(
              'text-xs text-muted-foreground font-sans font-normal bg-muted/60 px-1.5 py-0.5 rounded',
              enClassName
            )}
            dir="ltr"
          >
            {en}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted text-xs font-medium border border-border/40',
          className
        )}
      >
        <span className={cn('text-foreground', arClassName)} dir="rtl">{ar || '—'}</span>
        <span className="text-muted-foreground/40 font-mono">|</span>
        <span className={cn('text-muted-foreground font-sans', enClassName)} dir="ltr">{en || '—'}</span>
      </div>
    );
  }

  if (variant === 'description') {
    return (
      <div className={cn('space-y-1 max-w-md', className)}>
        {ar && (
          <p
            className={cn(
              'text-xs text-foreground/90 leading-relaxed',
              truncate && 'truncate',
              arClassName
            )}
            dir="rtl"
            title={ar}
          >
            {ar}
          </p>
        )}
        {en ? (
          <p
            className={cn(
              'text-[11px] text-muted-foreground font-sans leading-relaxed flex items-center gap-1',
              truncate && 'truncate',
              enClassName
            )}
            dir="ltr"
            title={en}
          >
            <span className="shrink-0 text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground/80 font-bold border border-border/40">
              EN
            </span>
            <span className={truncate ? 'truncate' : ''}>{en}</span>
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground/50 font-sans italic" dir="ltr">
            (No English translation)
          </p>
        )}
      </div>
    );
  }

  // Default 'stacked' variant (Header / title / name style)
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span
        className={cn(
          'font-bold text-foreground text-sm leading-snug',
          truncate && 'truncate',
          arClassName
        )}
        dir="rtl"
      >
        {ar || en}
      </span>
      {en ? (
        <span
          className={cn(
            'text-xs text-muted-foreground font-sans flex items-center gap-1 tracking-tight',
            truncate && 'truncate',
            enClassName
          )}
          dir="ltr"
        >
          <span className="shrink-0 text-[9px] font-bold px-1 py-0.2 rounded bg-muted/80 text-muted-foreground/80 border border-border/40 uppercase">
            EN
          </span>
          <span className={truncate ? 'truncate' : ''}>{en}</span>
        </span>
      ) : (
        <span className="text-[10px] text-muted-foreground/40 font-sans italic" dir="ltr">
          (No English)
        </span>
      )}
    </div>
  );
}
