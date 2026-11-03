import { Shield, Mail, Calendar } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useProfile } from '../hooks/useAuthMutations';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';

export default function ProfilePage() {
  const storeUser = useAuthStore((s) => s.user);
  const { data: profileResponse, isLoading: profileLoading } = useProfile();

  const user = profileResponse?.data || storeUser;

  if (profileLoading && !user) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse" dir="rtl">
        جاري تحميل الملف الشخصي...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="الملف الشخصي"
        description="عرض معلومات الحساب فقط. لا يمكن تعديل البيانات الشخصية."
      />

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mb-4 border border-primary/20">
            {user?.name?.slice(0, 2)?.toUpperCase() || 'AD'}
          </div>
          <h2 className="text-xl font-bold text-foreground">{user?.name || 'مدير النظام'}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
          <div className="mt-3">
            <StatusBadge status={user?.role || 'admin'} type="role" />
          </div>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> الحالة:
            </span>
            <span className="font-medium text-emerald-600">نشط</span>
          </div>
          {user?.last_login_at && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> آخر دخول:
              </span>
              <span className="font-medium">{new Date(user.last_login_at).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
