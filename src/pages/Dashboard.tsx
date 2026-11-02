import { lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/features/services/hooks/useServices';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useUsers } from '@/features/users/hooks/useUsers';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { DashboardStatGrid } from './dashboard/DashboardStatGrid';
import { DashboardQuickActions } from './dashboard/DashboardQuickActions';
import { DashboardRecentMessages } from './dashboard/DashboardRecentMessages';
import { DashboardRecentPosts } from './dashboard/DashboardRecentPosts';

const DashboardAnalyticsChart = lazy(() =>
  import('./dashboard/DashboardAnalyticsChart').then((m) => ({
    default: m.DashboardAnalyticsChart,
  }))
);

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: servicesRes } = useServices();
  const { data: projectsRes } = useProjects();
  const { data: postsRes } = usePosts();
  const { data: messagesRes } = useMessages();
  const { data: usersRes } = useUsers();

  const servicesCount = servicesRes?.data?.length ?? 0;
  const projectsCount = projectsRes?.data?.length ?? 0;
  const postsCount = postsRes?.data?.length ?? 0;
  const messagesCount = messagesRes?.data?.length ?? 0;
  const usersCount = usersRes?.data?.length ?? 0;

  const newMessagesCount =
    messagesRes?.data?.filter((m) => m.status === 'new').length ?? 0;

  const chartData = [
    { name: 'الخدمات', count: servicesCount },
    { name: 'المشاريع', count: projectsCount },
    { name: 'المقالات', count: postsCount },
    { name: 'الرسائل', count: messagesCount },
    { name: 'المستخدمين', count: usersCount },
  ];

  const recentMessages = messagesRes?.data?.slice(0, 5) || [];
  const recentPosts = postsRes?.data?.slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="نظرة عامة على النظام"
        description="متابعة الأداء وإحصائيات المحتوى ونشاط منصة Nexora"
        action={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/dashboard/projects/new')}
              size="sm"
              className="rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>مشروع جديد</span>
            </Button>
            <Button
              onClick={() => navigate('/dashboard/blog/new')}
              variant="outline"
              size="sm"
              className="rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>مقال جديد</span>
            </Button>
          </div>
        }
      />

      {/* Stat Cards Row */}
      <DashboardStatGrid
        projectsCount={projectsCount}
        servicesCount={servicesCount}
        postsCount={postsCount}
        messagesCount={messagesCount}
        newMessagesCount={newMessagesCount}
      />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Suspense
          fallback={
            <div className="lg:col-span-2 h-[340px] rounded-2xl border bg-card/60 animate-pulse flex items-center justify-center text-xs text-muted-foreground">
              جاري تحميل المخطط البياني...
            </div>
          }
        >
          <DashboardAnalyticsChart data={chartData} />
        </Suspense>
        <DashboardQuickActions />
      </div>

      {/* Recent Activity: Messages & Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardRecentMessages messages={recentMessages} />
        <DashboardRecentPosts posts={recentPosts} />
      </div>
    </div>
  );
}