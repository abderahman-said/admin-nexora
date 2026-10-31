import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Service, ServiceFormData } from '../types/service.types';

export const servicesApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<Service[]>> => {
    const response = await apiClient.get<ApiResponse<Service[]>>(ENDPOINTS.services.list, {
      params,
    });
    return response.data;
  },

  getById: async (id: number | string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get<ApiResponse<Service>>(ENDPOINTS.services.detail(id));
    return response.data;
  },

  create: async (data: ServiceFormData): Promise<ApiResponse<Service>> => {
    const response = await apiClient.post<ApiResponse<Service>>(ENDPOINTS.services.create, data);
    return response.data;
  },

  update: async (id: number | string, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> => {
    const response = await apiClient.patch<ApiResponse<Service>>(
      ENDPOINTS.services.update(id),
      data
    );
    return response.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.services.delete(id));
    return response.data;
  },

  toggleField: async (id: number | string, field = 'is_active'): Promise<ApiResponse<Service>> => {
    const response = await apiClient.patch<ApiResponse<Service>>(
      ENDPOINTS.services.toggle(id),
      { field }
    );
    return response.data;
  },

  reorder: async (ids: number[]): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(ENDPOINTS.services.reorder, { ids });
    return response.data;
  },
};
