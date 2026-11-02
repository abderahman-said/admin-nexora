import { Languages, Check } from 'lucide-react';
import { useLanguageViewStore, LanguageViewMode } from '@/store/useLanguageViewStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LanguageViewToggle({ className }: { className?: string }) {
  const { mode, setMode } = useLanguageViewStore();

  const labels: Record<LanguageViewMode, { title: string; badge: string }> = {
    both: { title: 'كلا اللغتين', badge: 'AR + EN' },
    ar: { title: 'العربية فقط', badge: 'AR' },
    en: { title: 'الإنجليزية فقط', badge: 'EN' },
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 rounded-xl px-2.5 gap-2 border-border/60 bg-card hover:bg-muted font-medium text-xs shadow-2xs',
            className
          )}
          title="تغيير لغة عرض البيانات في الجداول"
        >
          <Languages className="w-4 h-4 text-primary shrink-0" />
          <span className="hidden sm:inline text-foreground">{labels[mode].title}</span>
          <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px] tracking-wide">
            {labels[mode].badge}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-lg">
        <DropdownMenuItem
          onClick={() => setMode('both')}
          className="flex items-center justify-between text-xs cursor-pointer py-2 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">كلا اللغتين</span>
            <span className="text-[10px] text-muted-foreground">(AR + EN)</span>
          </div>
          {mode === 'both' && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setMode('ar')}
          className="flex items-center justify-between text-xs cursor-pointer py-2 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">العربية فقط</span>
            <span className="text-[10px] text-muted-foreground">(AR)</span>
          </div>
          {mode === 'ar' && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setMode('en')}
          className="flex items-center justify-between text-xs cursor-pointer py-2 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">الإنجليزية فقط</span>
            <span className="text-[10px] text-muted-foreground font-sans">(EN)</span>
          </div>
          {mode === 'en' && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
