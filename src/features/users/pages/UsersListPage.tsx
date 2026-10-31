import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, KeyRound, User, Mail, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useChangeRole,
  useResetUserPassword,
  useDeleteUser,
} from '../hooks/useUsers';
import { AdminUser, CreateUserPayload, UpdateUserPayload } from '../types/user.types';
import { UserRole } from '@/features/auth/types/auth.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/shared/forms/FormInput';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function UsersListPage() {
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const { data: response, isLoading, isError, refetch } = useUsers();
  const { mutate: createUser, isPending: creatingUser } = useCreateUser();
  const { mutate: updateUser, isPending: updatingUser } = useUpdateUser(selectedUser?.id || '');
  const { mutate: changeRole, isPending: changingRole } = useChangeRole();
  const { mutate: resetPassword, isPending: resettingPassword } = useResetUserPassword();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = response?.data || [];

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const {
    register: regCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useForm<CreateUserPayload>({
    defaultValues: { role: 'admin' },
  });

  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm<UpdateUserPayload>();

  const {
    register: regReset,
    handleSubmit: handleResetSubmit,
    reset: resetResetForm,
    formState: { errors: resetErrors },
  } = useForm<{ password: string }>();

  useEffect(() => {
    if (selectedUser && editDialogOpen) {
      resetEditForm({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
      });
    }
  }, [selectedUser, editDialogOpen, resetEditForm]);

  const onAddUser = (data: CreateUserPayload) => {
    createUser(data, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        resetCreateForm();
      },
    });
  };

  const onEditUser = (data: UpdateUserPayload) => {
    if (selectedUser) {
      updateUser(data, {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  const onResetPass = (data: { password: string }) => {
    if (selectedUser) {
      resetPassword(
        { id: selectedUser.id, password: data.password },
        {
          onSuccess: () => {
            setResetDialogOpen(false);
            resetResetForm();
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  const columns: Column<AdminUser>[] = [
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
        <select
          value={item.role}
          disabled={changingRole}
          onChange={(e) =>
            changeRole({ id: item.id, role: e.target.value as UserRole })
          }
          className="text-xs px-2.5 py-1 rounded-lg border border-border bg-card text-foreground focus:ring-1 focus:ring-primary/40 outline-none"
        >
          <option value="super_admin">مدير عام (Super Admin)</option>
          <option value="admin">مشرف (Admin)</option>
          <option value="observer">مراقب (Observer)</option>
        </select>
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
            onClick={() => {
              setSelectedUser(item);
              setEditDialogOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="إعادة تعيين كلمة المرور"
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            onClick={() => {
              setSelectedUser(item);
              setResetDialogOpen(true);
            }}
          >
            <KeyRound className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف المستخدم"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedUser(item);
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
        title="إدارة المستخدمين"
        description="إدارة حسابات المدراء والمشرفين والصلاحيات"
        action={
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مستخدم جديد</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا يوجد مستخدمين مسجلين"
        emptyDescription="أضف مستخدمين لمساعدتك في إدارة المنصة."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث بالاسم أو البريد...',
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit(onAddUser)} className="space-y-4 pt-2">
            <FormInput
              name="name"
              label="الاسم الكامل"
              placeholder="مثال: أحمد محمد"
              register={regCreate}
              error={createErrors.name?.message}
              rules={{ required: 'الاسم مطلوب' }}
            />

            <FormInput
              name="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="admin@example.com"
              register={regCreate}
              error={createErrors.email?.message}
              rules={{ required: 'البريد الإلكتروني مطلوب' }}
            />

            <PasswordInput
              name="password"
              label="كلمة المرور الأولية"
              placeholder="أدخل كلمة المرور"
              register={regCreate}
              error={createErrors.password?.message}
              rules={{
                required: 'كلمة المرور مطلوبة',
                minLength: { value: 8, message: 'يجب ألا تقل عن 8 خانات' },
              }}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">الصلاحية (الدور)</label>
              <select
                {...regCreate('role', { required: true })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="super_admin">مدير عام (Super Admin)</option>
                <option value="admin">مشرف (Admin - قراءة وتعديل)</option>
                <option value="observer">مراقب (Observer - قراءة فقط)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={creatingUser}
                loadingText="جاري الإضافة..."
                className="rounded-xl px-6"
              >
                حفظ المستخدم
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              تعديل بيانات {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit(onEditUser)} className="space-y-4 pt-2">
            <FormInput
              name="name"
              label="الاسم الكامل"
              placeholder="مثال: أحمد محمد"
              register={regEdit}
              error={editErrors.name?.message}
              rules={{ required: 'الاسم مطلوب' }}
            />

            <FormInput
              name="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="admin@example.com"
              register={regEdit}
              error={editErrors.email?.message}
              rules={{ required: 'البريد الإلكتروني مطلوب' }}
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={updatingUser}
                loadingText="جاري التحديث..."
                className="rounded-xl px-6"
              >
                حفظ التعديلات
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              إعادة تعيين كلمة المرور لـ {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleResetSubmit(onResetPass)} className="space-y-4 pt-2">
            <PasswordInput
              name="password"
              label="كلمة المرور الجديدة"
              placeholder="أدخل كلمة المرور الجديدة"
              register={regReset}
              error={resetErrors.password?.message}
              rules={{
                required: 'كلمة المرور مطلوبة',
                minLength: { value: 8, message: 'يجب ألا تقل عن 8 خانات' },
              }}
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetDialogOpen(false)}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={resettingPassword}
                loadingText="جاري التعيين..."
                className="rounded-xl px-6"
              >
                تعيين كلمة المرور
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف حساب "${selectedUser?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
