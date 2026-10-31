import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi } from '../api/projectsApi';
import { ProjectFormData } from '../types/project.types';
import { PaginationParams } from '@/api/types';

export const projectKeys = {
  all: ['projects'] as const,
  list: (params?: PaginationParams) => ['projects', 'list', params] as const,
  detail: (id: number | string) => ['projects', 'detail', id] as const,
};

export function useProjects(params?: PaginationParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => projectsApi.list(params),
  });
}

export function useProject(id: number | string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectFormData) => projectsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(res.message || 'تم إنشاء المشروع بنجاح');
    },
  });
}

export function useUpdateProject(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProjectFormData>) => projectsApi.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(res.message || 'تم تحديث المشروع بنجاح');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => projectsApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(res.message || 'تم حذف المشروع بنجاح');
    },
  });
}

export function useToggleProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, field }: { id: number | string; field: 'is_active' | 'is_featured' }) =>
      projectsApi.toggleField(id, field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success('تم تحديث حالة المشروع');
    },
  });
}
