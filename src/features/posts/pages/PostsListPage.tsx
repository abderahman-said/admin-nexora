import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePosts, useDeletePost } from '../hooks/usePosts';
import { Post } from '../types/post.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';

export default function PostsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = usePosts();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const posts = response?.data || [];

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title?.ar?.toLowerCase().includes(q) ||
        p.title?.en?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  const handleDelete = () => {
    if (selectedPost) {
      deletePost(selectedPost.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedPost(null);
        },
      });
    }
  };

  const columns: Column<Post>[] = [
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
                className="w-12 h-12 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="font-bold text-foreground max-w-xs truncate">{item.title?.ar || item.title?.en}</p>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'الوصف المختصر',
      cell: (item) => (
        <p className="text-xs text-muted-foreground max-w-sm truncate">
          {item.short_description?.ar || item.short_description?.en || '—'}
        </p>
      ),
    },
    {
      header: 'تاريخ النشر',
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : 'حديثاً'}</span>
        </div>
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.is_active ?? true} />,
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
            onClick={() => navigate(`/dashboard/blog/${item.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedPost(item);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <PageHeader
        title="المقالات والمدونة"
        description="إدارة مقالات المدونة والأخبار التقنية المنشورة"
        action={
          <Button
            onClick={() => navigate('/dashboard/blog/new')}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>كتابة مقال جديد</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filteredPosts}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد مقالات منشورة"
        emptyDescription="ابدأ بكتابة أول مقال في مدونتك."
        emptyActionLabel="كتابة مقال الآن"
        onEmptyAction={() => navigate('/dashboard/blog/new')}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث في المقالات...',
        }}
        keyExtractor={(item) => item.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف المقال"
        description={`هل أنت متأكد من حذف المقال "${selectedPost?.title?.ar || selectedPost?.title?.en}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
