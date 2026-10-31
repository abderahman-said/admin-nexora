import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: boolean | string;
  type?: 'boolean' | 'role' | 'message';
  className?: string;
}

export default function StatusBadge({ status, type = 'boolean', className }: StatusBadgeProps) {
  if (type === 'boolean') {
    const isActive = Boolean(status);
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-colors',
          isActive
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          className
        )}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isActive ? 'bg-emerald-500' : 'bg-rose-500'
          )}
        />
        {isActive ? 'نشط' : 'غير نشط'}
      </span>
    );
  }

  if (type === 'role') {
    const roleMap: Record<string, { label: string; style: string }> = {
      super_admin: {
        label: 'مدير عام',
        style: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      },
      admin: {
        label: 'مشرف',
        style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      },
      observer: {
        label: 'مراقب (قراءة فقط)',
        style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      },
    };

    const role = roleMap[String(status)] || {
      label: String(status),
      style: 'bg-muted text-muted-foreground border-border',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          role.style,
          className
        )}
      >
        {role.label}
      </span>
    );
  }

  if (type === 'message') {
    const statusMap: Record<string, { label: string; style: string }> = {
      new: {
        label: 'جديدة',
        style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      },
      read: {
        label: 'مقروءة',
        style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      },
      in_progress: {
        label: 'قيد المتابعة',
        style: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      },
      closed: {
        label: 'مغلقة',
        style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      },
    };

    const item = statusMap[String(status)] || {
      label: String(status),
      style: 'bg-muted text-muted-foreground border-border',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          item.style,
          className
        )}
      >
        {item.label}
      </span>
    );
  }

  return <span>{String(status)}</span>;
}
