import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { servicesApi } from '../api/servicesApi';
import { ServiceFormData } from '../types/service.types';
import { PaginationParams } from '@/api/types';

export const serviceKeys = {
  all: ['services'] as const,
  list: (params?: PaginationParams) => ['services', 'list', params] as const,
  detail: (id: number | string) => ['services', 'detail', id] as const,
};

export function useServices(params?: PaginationParams) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => servicesApi.list(params),
  });
}

export function useService(id: number | string) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => servicesApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceFormData) => servicesApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success(res.message || 'تمت إضافة الخدمة بنجاح');
    },
  });
}

export function useUpdateService(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ServiceFormData>) => servicesApi.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success(res.message || 'تم تعديل الخدمة بنجاح');
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => servicesApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success(res.message || 'تم حذف الخدمة بنجاح');
    },
  });
}

export function useToggleService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => servicesApi.toggleField(id, 'is_active'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success('تم تحديث حالة الخدمة');
    },
  });
}
