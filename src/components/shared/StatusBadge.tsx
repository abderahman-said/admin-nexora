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
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
          isActive
            ? 'bg-success-subtle text-success-foreground border-success/20'
            : 'bg-muted text-muted-foreground border-border',
          className
        )}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            isActive ? 'bg-success' : 'bg-muted-foreground'
          )}
        />
        <span>{isActive ? 'نشط' : 'غير نشط'}</span>
      </span>
    );
  }

  if (type === 'role') {
    const roleMap: Record<string, { label: string; style: string }> = {
      super_admin: {
        label: 'مدير عام',
        style: 'bg-primary-subtle text-primary border-primary/20',
      },
      admin: {
        label: 'مشرف',
        style: 'bg-info-subtle text-info-foreground border-info/20',
      },
      observer: {
        label: 'مراقب (قراءة فقط)',
        style: 'bg-muted text-muted-foreground border-border',
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
    const statusMap: Record<string, { label: string; style: string; dot: string }> = {
      new: {
        label: 'جديدة',
        style: 'bg-warning-subtle text-warning-foreground border-warning/20',
        dot: 'bg-warning',
      },
      read: {
        label: 'مقروءة',
        style: 'bg-info-subtle text-info-foreground border-info/20',
        dot: 'bg-info',
      },
      in_progress: {
        label: 'قيد المتابعة',
        style: 'bg-primary-subtle text-primary border-primary/20',
        dot: 'bg-primary',
      },
      closed: {
        label: 'مغلقة',
        style: 'bg-muted text-muted-foreground border-border',
        dot: 'bg-muted-foreground',
      },
    };

    const item = statusMap[String(status)] || {
      label: String(status),
      style: 'bg-muted text-muted-foreground border-border',
      dot: 'bg-muted-foreground',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
          item.style,
          className
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', item.dot)} />
        <span>{item.label}</span>
      </span>
    );
  }

  return <span>{String(status)}</span>;
}
