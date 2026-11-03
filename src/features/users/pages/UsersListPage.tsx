import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
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
import useAuthStore from '@/store/useAuthStore';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getUsersColumns } from '../components/users.columns';
import { CreateUserDialog } from '../components/CreateUserDialog';
import { EditUserDialog } from '../components/EditUserDialog';
import { ResetPasswordDialog } from '../components/ResetPasswordDialog';
import { canManageUser } from '../lib/userPermissions';

export default function UsersListPage() {
  const currentRole = useAuthStore((s) => s.user?.role) as UserRole | undefined;
  const canCreateUsers = currentRole === 'super_admin';
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

  const onAddUser = (data: CreateUserPayload) => {
    createUser(data, {
      onSuccess: () => setCreateDialogOpen(false),
    });
  };

  const canManage = useCallback(
    (user: AdminUser) => canManageUser(currentRole, user.role),
    [currentRole]
  );

  const onEditUser = (dirty: Partial<UpdateUserPayload>) => {
    if (!selectedUser || !canManage(selectedUser)) return;
    updateUser(dirty, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setSelectedUser(null);
      },
    });
  };

  const onResetPass = (data: { password: string }) => {
    if (!selectedUser || !canManage(selectedUser)) return;
    resetPassword(
      { id: selectedUser.id, password: data.password },
      {
        onSuccess: () => {
          setResetDialogOpen(false);
          setSelectedUser(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedUser || !canManage(selectedUser)) return;
    deleteUser(selectedUser.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedUser(null);
      },
    });
  };

  const columns = useMemo(
    () =>
      getUsersColumns({
        changingRole,
        canChangeRole: currentRole === 'super_admin',
        canManage,
        onChangeRole: (id: string | number, role: UserRole) => {
          const target = users.find((user) => String(user.id) === String(id));
          if (!target || !canManage(target) || role === 'super_admin') return;
          changeRole({ id, role });
        },
        onEdit: (user) => {
          if (!canManage(user)) return;
          setSelectedUser(user);
          setEditDialogOpen(true);
        },
        onResetPassword: (user) => {
          if (!canManage(user)) return;
          setSelectedUser(user);
          setResetDialogOpen(true);
        },
        onDelete: (user) => {
          if (!canManage(user)) return;
          setSelectedUser(user);
          setDeleteOpen(true);
        },
      }),
    [changingRole, changeRole, canManage, currentRole, users]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="إدارة المستخدمين"
        description="إدارة حسابات المدراء والمشرفين والصلاحيات"
        action={
          canCreateUsers ? (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مستخدم جديد</span>
            </Button>
          ) : undefined
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

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={onAddUser}
        isLoading={creatingUser}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={onEditUser}
        isLoading={updatingUser}
      />

      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={(open) => {
          setResetDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={onResetPass}
        isLoading={resettingPassword}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedUser(null);
        }}
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف حساب "${selectedUser?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
