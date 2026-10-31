import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  change,
  positive = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative bg-card border border-border/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all overflow-hidden group',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
              positive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            )}
          >
            {positive ? (
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 ml-0.5" />
            )}
            {change}
          </span>
        )}
      </div>

      {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
    </div>
  );
}
