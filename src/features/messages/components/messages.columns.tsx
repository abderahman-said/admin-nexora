import { Eye, Trash2, Mail } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ContactMessage } from '../types/message.types';

interface GetMessagesColumnsProps {
  canWrite: boolean;
  onOpenDetails: (item: ContactMessage) => void;
  onDelete: (item: ContactMessage) => void;
}

export function getMessagesColumns({
  canWrite,
  onOpenDetails,
  onDelete,
}: GetMessagesColumnsProps): Column<ContactMessage>[] {
  return [
    {
      header: 'المرسل',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الموضوع',
      cell: (item) => (
        <div>
          <p className="font-medium text-foreground text-sm">
            {item.subject || 'بدون موضوع'}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-xs">
            {item.message}
          </p>
        </div>
      ),
    },
    {
      header: 'الهاتف',
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.phone || '—'}
        </span>
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.status} type="message" />,
    },
    {
      header: 'التاريخ',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString('ar-EG')
            : '—'}
        </span>
      ),
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            title="عرض التفاصيل"
            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => onOpenDetails(item)}
          >
            <Eye className="w-4 h-4" />
          </Button>

          {canWrite && (
            <Button
              size="icon"
              variant="ghost"
              title="حذف"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];
}

export default getMessagesColumns;
