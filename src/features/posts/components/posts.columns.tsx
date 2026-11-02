import { Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { Post } from '../types/post.types';

interface GetPostsColumnsProps {
  onEdit: (item: Post) => void;
  onDelete: (item: Post) => void;
}

export function getPostsColumns({
  onEdit,
  onDelete,
}: GetPostsColumnsProps): Column<Post>[] {
  return [
    {
      header: 'المقال',
      cell: (item) => {
        const cover = getMediaUrl(item.image) || getMediaUrl(item.image_cover);
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
                <FileText className="w-6 h-6" />
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
      header: 'الوصف المختصر',
      cell: (item) => (
        <BilingualText text={item.short_description} variant="description" truncate />
      ),
    },
    {
      header: 'تاريخ النشر',
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString('ar-EG')
              : 'حديثاً'}
          </span>
        </div>
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => {
        const isPublished = Boolean(
          item.published_at && new Date(item.published_at) <= new Date()
        );
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              isPublished
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isPublished ? 'منشور' : 'مسودة'}
          </span>
        );
      },
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
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

export default getPostsColumns;
