import {
  Layers,
  Briefcase,
  FileText,
  MessageSquare,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useServices } from '@/features/services/hooks/useServices';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useUsers } from '@/features/users/hooks/useUsers';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

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

  // Chart data based on resource distribution
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
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      <PageHeader
        title="لوحة التحكم الإدارية"
        description="نظرة عامة على أداء ومحتوى منصة Nexora"
        action={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/dashboard/projects/new')}
              className="rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>مشروع جديد</span>
            </Button>
            <Button
              onClick={() => navigate('/dashboard/blog/new')}
              variant="outline"
              className="rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>مقال جديد</span>
            </Button>
          </div>
        }
      />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المشاريع"
          value={projectsCount}
          sub="معرض الأعمال المنجزة"
          icon={Briefcase}
          change="+12%"
          positive
        />

        <StatCard
          title="الخدمات المقدمة"
          value={servicesCount}
          sub="باقات وحلول الشركة"
          icon={Layers}
          change="+5%"
          positive
        />

        <StatCard
          title="مقالات المدونة"
          value={postsCount}
          sub="الأخبار والمقالات المنشورة"
          icon={FileText}
          change="+8%"
          positive
        />

        <StatCard
          title="رسائل التواصل"
          value={messagesCount}
          sub={newMessagesCount > 0 ? `${newMessagesCount} رسالة غير مقروءة` : 'لا توجد رسائل جديدة'}
          icon={MessageSquare}
          change={newMessagesCount > 0 ? `${newMessagesCount} جديدة` : 'مكتمل'}
          positive={newMessagesCount === 0}
        />
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Distribution Chart */}
        <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-foreground text-lg">توزيع موارد المنصة</h3>
              <p className="text-xs text-muted-foreground">حجم وتوزيع المحتوى والبيانات الحالية</p>
            </div>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.75rem',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-bold text-foreground text-lg">الوصول السريع</h3>
            <p className="text-xs text-muted-foreground">أكثر المهام والإجراءات استخداماً</p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">إدارة المشاريع</p>
                  <p className="text-[11px] text-muted-foreground">معرض الأعمال وتفاصيلها</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => navigate('/dashboard/services')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">إدارة الخدمات</p>
                  <p className="text-[11px] text-muted-foreground">إضافة وبناء باقات الخدمات</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => navigate('/dashboard/messages')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">صندوق الرسائل</p>
                  <p className="text-[11px] text-muted-foreground">استفسارات وتواصل العملاء</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => navigate('/dashboard/users')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">فريق الإدارة والمدراء</p>
                  <p className="text-[11px] text-muted-foreground">الصلاحيات والحسابات</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections (Messages & Posts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-foreground text-base">أحدث الرسائل الواردة</h3>
              <p className="text-xs text-muted-foreground">استفسارات تم استلامها مؤخراً</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/messages')}
              className="text-xs text-primary"
            >
              عرض الكل
            </Button>
          </div>

          <div className="divide-y divide-border/50">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">لا توجد رسائل واردة حالياً</p>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate('/dashboard/messages')}
                  className="py-3 flex items-center justify-between hover:bg-muted/30 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {msg.name?.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{msg.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{msg.subject || msg.message}</p>
                    </div>
                  </div>
                  <StatusBadge status={msg.status} type="message" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-foreground text-base">أحدث المقالات</h3>
              <p className="text-xs text-muted-foreground">آخر المقالات المنشورة في المدونة</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/blog')}
              className="text-xs text-primary"
            >
              عرض الكل
            </Button>
          </div>

          <div className="divide-y divide-border/50">
            {recentPosts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">لا توجد مقالات منشورة حالياً</p>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/dashboard/blog/${post.id}/edit`)}
                  className="py-3 flex items-center justify-between hover:bg-muted/30 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground truncate max-w-[220px]">
                        {post.title?.ar || post.title?.en}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{post.slug}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('ar-EG') : 'حديثاً'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}