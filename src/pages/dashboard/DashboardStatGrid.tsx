import { Briefcase, Layers, FileText, MessageSquare } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';

interface DashboardStatGridProps {
  projectsCount: number;
  servicesCount: number;
  postsCount: number;
  messagesCount: number;
  newMessagesCount: number;
}

export function DashboardStatGrid({
  projectsCount,
  servicesCount,
  postsCount,
  messagesCount,
  newMessagesCount,
}: DashboardStatGridProps) {
  return (
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
        sub={
          newMessagesCount > 0
            ? `${newMessagesCount} جديدة غير مقروءة`
            : 'تمت متابعة الكل'
        }
        icon={MessageSquare}
        change={newMessagesCount > 0 ? `${newMessagesCount} جديدة` : 'مكتمل'}
        positive={newMessagesCount === 0}
      />
    </div>
  );
}

export default DashboardStatGrid;
