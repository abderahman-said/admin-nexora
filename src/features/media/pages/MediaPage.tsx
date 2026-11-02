import { useState } from 'react';
import { Image as ImageIcon, Trash2, Folder, ExternalLink } from 'lucide-react';
import { useMedia, useDeleteMedia } from '../hooks/useMedia';
import { MediaItem } from '../types/media.types';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';

export default function MediaPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const { data: res, isLoading, isError, refetch } = useMedia(selectedFolder || undefined);
  const { mutate: deleteMedia, isPending: deleting } = useDeleteMedia();

  const mediaList = res?.data || [];

  const folders = ['all', 'projects', 'posts', 'team', 'sections'];

  const handleDelete = () => {
    if (selectedMedia) {
      deleteMedia(selectedMedia.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedMedia(null);
        },
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="مكتبة الوسائط"
        description="استعراض وإدارة الصور والملفات المرفوعة عبر النظام"
        action={
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl text-xs font-semibold">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f === 'all' ? '' : f)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  (f === 'all' && !selectedFolder) || selectedFolder === f
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{f === 'all' ? 'جميع الملفات' : f}</span>
              </button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted/60 rounded-2xl border" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center border rounded-2xl bg-card">
          <p className="text-destructive font-medium mb-3">تعذر تحميل الوسائط</p>
          <Button onClick={() => refetch()} variant="outline" className="rounded-xl">
            إعادة المحاولة
          </Button>
        </div>
      ) : mediaList.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="لا توجد وسائط في هذا المجلد"
          description="تظهر الصور تلقائياً هنا عند رفعها في المشاريع أو المقالات أو أقسام الموقع."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => {
            const url = getMediaUrl(item) || item.url || item.file_path || '';
            return (
              <div
                key={item.id}
                className="group relative aspect-square bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-end"
              >
                <img
                  src={url}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <div className="flex justify-end gap-1.5">
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
                        title="فتح الصورة"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedMedia(item);
                        setDeleteOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-destructive/80 text-white hover:bg-destructive transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                    {item.folder && (
                      <p className="text-white/70 text-[10px] mt-0.5">{item.folder}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف ملف الوسائط"
        description={`هل أنت متأكد من حذف هذا الملف نهائياً؟ قد يتأثر أي محتوى يستخدم هذا الرابط.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
