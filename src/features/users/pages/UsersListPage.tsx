import { useState, useMemo } from 'react';
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
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getUsersColumns } from '../components/users.columns';
import { CreateUserDialog } from '../components/CreateUserDialog';
import { EditUserDialog } from '../components/EditUserDialog';
import { ResetPasswordDialog } from '../components/ResetPasswordDialog';

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

  const onAddUser = (data: CreateUserPayload) => {
    createUser(data, {
      onSuccess: () => setCreateDialogOpen(false),
    });
  };

  const onEditUser = (dirty: UpdateUserPayload) => {
    if (!selectedUser) return;
    updateUser(dirty, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setSelectedUser(null);
      },
    });
  };

  const onResetPass = (data: { password: string }) => {
    if (!selectedUser) return;
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
    if (!selectedUser) return;
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
        onChangeRole: (id: string, role: UserRole) => changeRole({ id, role }),
        onEdit: (user) => {
          setSelectedUser(user);
          setEditDialogOpen(true);
        },
        onResetPassword: (user) => {
          setSelectedUser(user);
          setResetDialogOpen(true);
        },
        onDelete: (user) => {
          setSelectedUser(user);
          setDeleteOpen(true);
        },
      }),
    [changingRole, changeRole]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
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
