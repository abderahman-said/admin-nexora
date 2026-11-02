import { Edit, Trash2, Power, Layers } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { Service } from '../types/service.types';

interface GetServicesColumnsProps {
  onToggle: (id: number) => void;
  onEdit: (item: Service) => void;
  onDelete: (item: Service) => void;
}

export function getServicesColumns({
  onToggle,
  onEdit,
  onDelete,
}: GetServicesColumnsProps): Column<Service>[] {
  return [
    {
      header: 'اسم الخدمة',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <BilingualText text={item.title} variant="stacked" />
            <p className="text-[11px] text-muted-foreground font-mono">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الوصف المختصر',
      cell: (item) => (
        <BilingualText text={item.short_description} variant="description" truncate />
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
            title="تعديل"
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

export default getServicesColumns;
