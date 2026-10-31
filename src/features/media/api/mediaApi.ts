import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/api/types';
import { MediaItem } from '../types/media.types';

export const mediaApi = {
  list: async (folder?: string): Promise<ApiResponse<MediaItem[]>> => {
    const res = await apiClient.get<ApiResponse<MediaItem[]>>(ENDPOINTS.media.list, {
      params: folder ? { folder } : undefined,
    });
    return res.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.media.delete(id));
    return res.data;
  },
};
