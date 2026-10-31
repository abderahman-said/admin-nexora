import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { mediaApi } from '../api/mediaApi';

export const mediaKeys = {
  all: ['media'] as const,
  list: (folder?: string) => ['media', 'list', folder] as const,
};

export function useMedia(folder?: string) {
  return useQuery({
    queryKey: mediaKeys.list(folder),
    queryFn: () => mediaApi.list(folder),
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => mediaApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success(res.message || 'تم حذف الملف بنجاح');
    },
  });
}
