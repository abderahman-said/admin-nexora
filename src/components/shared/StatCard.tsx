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
  // SVG sparkline path
  const sparklinePoints = positive
    ? "M 0,22 Q 15,18 30,20 T 60,12 T 90,8 T 120,3"
    : "M 0,4 Q 15,10 30,8 T 60,16 T 90,19 T 120,22";

  return (
    <div
      className={cn(
        'relative bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-card transition-all duration-200 overflow-hidden group flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight tabular-nums">
              {value}
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-primary/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md border shrink-0',
                positive
                  ? 'bg-success-subtle text-success-foreground border-success/20'
                  : 'bg-danger-subtle text-danger-foreground border-danger/20'
              )}
            >
              {positive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{change}</span>
            </span>
          )}

          {sub && (
            <span className="text-[11px] text-muted-foreground truncate" title={sub}>
              {sub}
            </span>
          )}
        </div>

        {/* Mini sparkline curve */}
        <div className="w-16 h-6 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 120 26" className="w-full h-full overflow-visible">
            <path
              d={sparklinePoints}
              fill="none"
              stroke={positive ? "var(--color-success)" : "var(--color-danger)"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
