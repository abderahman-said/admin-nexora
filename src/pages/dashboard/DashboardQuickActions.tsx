import { Briefcase, Layers, MessageSquare, Users, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCanWrite } from '@/hooks/useCanWrite';

export function DashboardQuickActions() {
  const navigate = useNavigate();
  const canWrite = useCanWrite();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="border-b border-border/70 pb-4">
        <h3 className="font-semibold text-foreground text-base">إجراءات سريعة</h3>
        <p className="text-xs text-muted-foreground mt-0.5">أكثر المهام والصفحات استخداماً</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/50 hover:border-border/90 transition-all text-start group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-subtle text-primary group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">إدارة المشاريع</p>
              <p className="text-[11px] text-muted-foreground">معرض الأعمال وتفاصيلها</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={() => navigate('/dashboard/services')}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/50 hover:border-border/90 transition-all text-start group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-subtle text-primary group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">إدارة الخدمات</p>
              <p className="text-[11px] text-muted-foreground">إضافة وبناء باقات الخدمات</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={() => navigate('/dashboard/messages')}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/50 hover:border-border/90 transition-all text-start group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-subtle text-primary group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">صندوق الرسائل</p>
              <p className="text-[11px] text-muted-foreground">استفسارات وتواصل العملاء</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {canWrite && (
          <button
            onClick={() => navigate('/dashboard/users')}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/50 hover:border-border/90 transition-all text-start group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-subtle text-primary group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">المستخدمين والصلاحيات</p>
                <p className="text-[11px] text-muted-foreground">إدارة فريق العمل والمدراء</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}

export default DashboardQuickActions;
