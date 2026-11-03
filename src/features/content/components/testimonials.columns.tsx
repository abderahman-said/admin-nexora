import { Edit, Trash2, Power, Star } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { Testimonial } from '../types/content.types';

interface GetTestimonialsColumnsProps {
  onToggle: (id: number) => void;
  onEdit: (item: Testimonial) => void;
  onDelete: (item: Testimonial) => void;
}

export function getTestimonialsColumns({
  onToggle,
  onEdit,
  onDelete,
}: GetTestimonialsColumnsProps): Column<Testimonial>[] {
  return [
    {
      header: 'العميل',
      cell: (item) => {
        const img = getMediaUrl((item as any).client_image);
        return (
          <div className="flex items-center gap-3">
            {img ? (
              <img
                src={img}
                alt={item.client_name?.ar}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {item.client_name?.ar?.slice(0, 2) || 'CL'}
              </div>
            )}
            <div className="space-y-0.5">
              <BilingualText text={item.client_name} variant="stacked" />
              <BilingualText text={item.client_job} variant="inline" fallback="عميل" />
            </div>
          </div>
        );
      },
    },
    {
      header: 'التعليق',
      cell: (item) => (
        <BilingualText text={item.comment} variant="description" truncate />
      ),
    },
    {
      header: 'الترتيب',
      align: 'center',
      cell: (item) => (
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
          {(item as any).sort_order ?? 1}
        </span>
      ),
    },
    {
      header: 'التقييم',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-0.5 text-amber-500">
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.is_active} />,
    },
    {
      header: 'الإجراءات',
      writeOnly: true,
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
            title="تعديل الرأي"
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
