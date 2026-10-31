import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { messagesApi } from '../api/messagesApi';
import { MessageStatus } from '../types/message.types';
import { PaginationParams } from '@/api/types';

export const messageKeys = {
  all: ['messages'] as const,
  list: (params?: PaginationParams) => ['messages', 'list', params] as const,
  detail: (id: number | string) => ['messages', 'detail', id] as const,
};

export function useMessages(params?: PaginationParams) {
  return useQuery({
    queryKey: messageKeys.list(params),
    queryFn: () => messagesApi.list(params),
  });
}

export function useMessage(id: number | string) {
  return useQuery({
    queryKey: messageKeys.detail(id),
    queryFn: () => messagesApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: MessageStatus }) =>
      messagesApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      toast.success('تم تحديث حالة الرسالة بنجاح');
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => messagesApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      toast.success(res.message || 'تم حذف الرسالة بنجاح');
    },
  });
}
