import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settingsApi';
import { SiteSettings } from '../types/settings.types';

export const settingsKeys = {
  current: ['settings'] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.current,
    queryFn: settingsApi.get,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => settingsApi.update(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.current });
      toast.success(res.message || 'تم حفظ إعدادات الموقع بنجاح');
    },
  });
}
