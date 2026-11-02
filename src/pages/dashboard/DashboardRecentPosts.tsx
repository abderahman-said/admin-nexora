import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Post } from '@/features/posts/types/post.types';

interface DashboardRecentPostsProps {
  posts: Post[];
}

export function DashboardRecentPosts({ posts }: DashboardRecentPostsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm">أحدث المقالات</h3>
          <p className="text-[11px] text-muted-foreground">آخر المقالات المنشورة في المدونة</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/blog')}
          className="text-xs text-primary hover:text-primary"
        >
          عرض الكل
        </Button>
      </div>

      <div className="divide-y divide-border/60">
        {posts.length === 0 ? (
          <p className="text-xs text-muted-foreground py-8 text-center">
            لا توجد مقالات منشورة حالياً
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/dashboard/blog/${post.id}/edit`)}
              className="py-3 flex items-center justify-between hover:bg-muted/40 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8.5 h-8.5 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[240px]">
                    {post.title?.ar || post.title?.en}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono truncate">
                    {post.slug}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 ms-2 font-mono tabular-nums">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString('ar-EG')
                  : 'حديثاً'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardRecentPosts;
