import { Edit, Trash2, Power, Star } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { TeamMember } from '../types/content.types';

interface GetTeamMembersColumnsProps {
  onToggle: (id: number) => void;
  onEdit: (item: TeamMember) => void;
  onDelete: (item: TeamMember) => void;
}

export function getTeamMembersColumns({
  onToggle,
  onEdit,
  onDelete,
}: GetTeamMembersColumnsProps): Column<TeamMember>[] {
  return [
    {
      header: 'عضو الفريق',
      cell: (item) => {
        const imgUrl = getMediaUrl(item.image);
        return (
          <div className="flex items-center gap-3">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={item.name?.ar}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {item.name?.ar?.slice(0, 2) || 'TM'}
              </div>
            )}
            <div className="space-y-0.5">
              <BilingualText text={item.name} variant="stacked" />
              <BilingualText text={item.job_title} variant="inline" />
            </div>
          </div>
        );
      },
    },
    {
      header: 'شارة التميز',
      cell: (item) => (
        <BilingualText text={item.badge_text} variant="badge" fallback="—" />
      ),
    },
    {
      header: 'الترتيب',
      align: 'center',
      cell: (item) => (
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
          {item.sort_order ?? 1}
        </span>
      ),
    },
    {
      header: 'مميز',
      align: 'center',
      cell: (item) => (
        <span
          className={`inline-flex items-center justify-center p-1 rounded-lg ${
            (item as any).is_highlighted
              ? 'text-amber-500 bg-amber-500/10'
              : 'text-slate-300'
          }`}
          title={(item as any).is_highlighted ? 'عضو مميز' : 'غير مميز'}
        >
          <Star
            className={`w-4 h-4 ${
              (item as any).is_highlighted ? 'fill-current' : ''
            }`}
          />
        </span>
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
