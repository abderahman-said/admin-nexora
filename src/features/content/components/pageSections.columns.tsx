import { LayoutTemplate, Edit } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import BilingualText from '@/components/shared/BilingualText';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import { PageSection } from '../types/content.types';

interface GetPageSectionsColumnsProps {
  onEdit: (item: PageSection) => void;
}

export function getPageSectionsColumns({
  onEdit,
}: GetPageSectionsColumnsProps): Column<PageSection>[] {
  return [
    {
      header: 'القسم',
      cell: (item) => {
        const imageUrl = getMediaUrl(item.image);
        const key = item.section_key || item.slug;
        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title?.ar}
                className="w-12 h-12 rounded-xl object-cover border shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <LayoutTemplate className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-0.5">
              <BilingualText text={item.title} variant="stacked" />
              <p className="text-[11px] text-muted-foreground font-mono">{key}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'الوصف / المحتوى',
      cell: (item) => (
        <BilingualText text={item.description} variant="description" truncate />
      ),
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl flex items-center gap-1.5"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>تعديل المحتوى</span>
        </Button>
      ),
    },
  ];
}
