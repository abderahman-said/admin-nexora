import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '../api/usersApi';
import { CreateUserPayload, UpdateUserPayload } from '../types/user.types';
import { UserRole } from '@/features/auth/types/auth.types';
import { PaginationParams } from '@/api/types';

export const userKeys = {
  all: ['users'] as const,
  list: (params?: PaginationParams) => ['users', 'list', params] as const,
  detail: (id: number | string) => ['users', 'detail', id] as const,
};

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const res = await usersApi.create(data);
      if (data.role && data.role !== 'observer' && res.data?.id) {
        try {
          await usersApi.changeRole(res.data.id, data.role);
          res.data.role = data.role;
        } catch (e) {
          console.warn('[Users] Failed to update role after creation:', e);
        }
      }
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(res.message || 'تمت إضافة المستخدم بنجاح');
    },
  });
}

export function useUpdateUser(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UpdateUserPayload>) => usersApi.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      toast.success(res.message || 'تم تحديث بيانات المستخدم');
    },
  });
}

export function useChangeRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number | string; role: UserRole }) =>
      usersApi.changeRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('تم تغيير الصلاحية بنجاح');
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: number | string; password: string }) =>
      usersApi.resetPassword(id, password),
    onSuccess: (res) => {
      toast.success(res.message || 'تم تعيين كلمة المرور الجديدة بنجاح');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => usersApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(res.message || 'تم حذف المستخدم بنجاح');
    },
  });
}
