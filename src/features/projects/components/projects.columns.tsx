import { Edit, Trash2, Power, Star, Briefcase } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { Project } from '../types/project.types';

interface GetProjectsColumnsProps {
  onToggleField: (id: number, field: 'is_active' | 'is_featured') => void;
  onEdit: (item: Project) => void;
  onDelete: (item: Project) => void;
}

export function getProjectsColumns({
  onToggleField,
  onEdit,
  onDelete,
}: GetProjectsColumnsProps): Column<Project>[] {
  return [
    {
      header: 'المشروع',
      cell: (item) => {
        const cover = getMediaUrl(item.cover_image) || getMediaUrl(item.image);
        return (
          <div className="flex items-center gap-3">
            {cover ? (
              <img
                src={cover}
                alt={item.title?.ar}
                className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
            )}
            <div className="space-y-0.5">
              <BilingualText text={item.title} variant="stacked" />
              <p className="text-[11px] text-muted-foreground font-mono">{item.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'الخدمة التابعة',
      cell: (item) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground inline-block">
          <BilingualText
            text={item.service?.title}
            variant="inline"
            fallback="غير محدد"
          />
        </span>
      ),
    },
    {
      header: 'مميز',
      align: 'center',
      cell: (item) => (
        <button
          onClick={() => onToggleField(item.id, 'is_featured')}
          className={`p-1.5 rounded-lg transition-colors ${
            item.is_featured
              ? 'text-amber-500 bg-amber-500/10'
              : 'text-slate-300 hover:text-slate-500'
          }`}
          title={item.is_featured ? 'مشروع مميز' : 'تمييز المشروع'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
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
            onClick={() => onToggleField(item.id, 'is_active')}
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

export default getProjectsColumns;
