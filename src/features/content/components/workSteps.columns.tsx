import { Edit, Trash2, Power } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { WorkStep } from '../types/content.types';

interface GetWorkStepsColumnsProps {
  onToggle: (id: number) => void;
  onEdit: (item: WorkStep) => void;
  onDelete: (item: WorkStep) => void;
}

export function getWorkStepsColumns({
  onToggle,
  onEdit,
  onDelete,
}: GetWorkStepsColumnsProps): Column<WorkStep>[] {
  return [
    {
      header: 'ترتيب',
      align: 'center',
      cell: (item) => (
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs inline-flex items-center justify-center">
          {item.step_number}
        </span>
      ),
    },
    {
      header: 'الخطوة',
      cell: (item) => {
        const iconUrl = getMediaUrl((item as any).icon);
        return (
          <div className="flex items-center gap-3">
            {iconUrl && (
              <img
                src={iconUrl}
                alt={item.title?.ar}
                className="w-10 h-10 rounded-xl object-contain p-1 border border-border bg-card shrink-0"
              />
            )}
            <BilingualText text={item.title} variant="stacked" />
          </div>
        );
      },
    },
    {
      header: 'شرح الخطوة',
      cell: (item) => (
        <BilingualText text={item.description} variant="description" truncate />
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.is_active} />,
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            title="تفعيل / تعطيل"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onToggle(item.id)}
          >
            <Power
              className={`w-4 h-4 ${
                item.is_active ? 'text-emerald-500' : 'text-slate-400'
              }`}
            />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="تعديل الخطوة"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => onEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
}
