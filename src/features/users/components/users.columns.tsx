import { User, Mail, Edit, KeyRound, Trash2 } from 'lucide-react';
import { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import FormSelect from '@/components/shared/forms/FormSelect';
import { Button } from '@/components/ui/button';
import { AdminUser } from '../types/user.types';
import { UserRole } from '@/features/auth/types/auth.types';

interface GetUsersColumnsProps {
  changingRole: boolean;
  onChangeRole: (id: string, role: UserRole) => void;
  onEdit: (user: AdminUser) => void;
  onResetPassword: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function getUsersColumns({
  changingRole,
  onChangeRole,
  onEdit,
  onResetPassword,
  onDelete,
}: GetUsersColumnsProps): Column<AdminUser>[] {
  return [
    {
      header: 'المستخدم',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" /> {item.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'الصلاحية (الدور)',
      cell: (item) => (
        <div className="w-44">
          <FormSelect
            value={item.role}
            disabled={changingRole}
            onChange={(val) => onChangeRole(item.id, val as UserRole)}
            options={[
              { value: 'super_admin', label: 'مدير عام (Super Admin)' },
              { value: 'admin', label: 'مشرف (Admin)' },
              { value: 'observer', label: 'مراقب (Observer)' },
            ]}
            triggerClassName="h-8 rounded-lg text-xs"
          />
        </div>
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.is_active} />,
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            title="تعديل المستخدم"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => onEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="إعادة تعيين كلمة المرور"
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            onClick={() => onResetPassword(item)}
          >
            <KeyRound className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف المستخدم"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
}
