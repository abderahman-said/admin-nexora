import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePosts, useDeletePost } from '../hooks/usePosts';
import { Post } from '../types/post.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useCanWrite } from '@/hooks/useCanWrite';
import { getPostsColumns } from '../components/posts.columns';

export default function PostsListPage() {
  const navigate = useNavigate();
  const canWrite = useCanWrite();
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

  const columns = useMemo(
    () =>
      getPostsColumns({
        onEdit: (item) => navigate(`/dashboard/blog/${item.id}/edit`),
        onDelete: (item) => {
          setSelectedPost(item);
          setDeleteOpen(true);
        },
      }),
    [navigate]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="المقالات والمدونة"
        description="إدارة ونشر مقالات وأخبار الشركة وتحديثاتها التقنية"
        action={
          canWrite ? (
            <Button
              onClick={() => navigate('/dashboard/blog/new')}
              className="rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>كتابة مقال جديد</span>
            </Button>
          ) : undefined
        }
      />

      <DataTable
        columns={columns}
        data={filteredPosts}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد مقالات منشورة"
        emptyDescription="ابدأ بكتابة مقالاتك التقنية وأخبار الشركة لإثراء المحتوى."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث بعنوان المقال أو الرابط...',
        }}
        keyExtractor={(item) => item.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedPost(null);
        }}
        title="حذف المقال"
        description={`هل أنت متأكد من حذف مقال "${
          selectedPost?.title?.ar || selectedPost?.title?.en
        }"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
