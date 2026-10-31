import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { postsApi } from '../api/postsApi';
import { PostFormData } from '../types/post.types';
import { PaginationParams } from '@/api/types';

export const postKeys = {
  all: ['posts'] as const,
  list: (params?: PaginationParams) => ['posts', 'list', params] as const,
  detail: (id: number | string) => ['posts', 'detail', id] as const,
};

export function usePosts(params?: PaginationParams) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsApi.list(params),
  });
}

export function usePost(id: number | string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostFormData) => postsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success(res.message || 'تم نشر المقال بنجاح');
    },
  });
}

export function useUpdatePost(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PostFormData>) => postsApi.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success(res.message || 'تم تحديث المقال بنجاح');
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => postsApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success(res.message || 'تم حذف المقال بنجاح');
    },
  });
}
