import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/api/types';
import { SiteSettings } from '../types/settings.types';

export const settingsApi = {
  get: async (): Promise<ApiResponse<SiteSettings>> => {
    const res = await apiClient.get<ApiResponse<SiteSettings>>(ENDPOINTS.settings.get);
    return res.data;
  },

  update: async (data: Partial<SiteSettings>): Promise<ApiResponse<SiteSettings>> => {
    const res = await apiClient.patch<ApiResponse<SiteSettings>>(ENDPOINTS.settings.update, data);
    return res.data;
  },
};
