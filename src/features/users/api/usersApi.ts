import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { AdminUser, CreateUserPayload, UpdateUserPayload } from '../types/user.types';
import { UserRole } from '@/features/auth/types/auth.types';
import { validateDevPayload } from '@/lib/payloadUtils';

export const toUserCreatePayload = (data: CreateUserPayload) => {
  validateDevPayload('POST /admin/users', data, ['name', 'email', 'password']);
  return {
    name: data.name,
    email: data.email,
    password: data.password,
  };
};

export const usersApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<AdminUser[]>> => {
    const response = await apiClient.get<ApiResponse<AdminUser[]>>(ENDPOINTS.users.list, {
      params,
    });
    return response.data;
  },

  getById: async (id: number | string): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.get<ApiResponse<AdminUser>>(ENDPOINTS.users.detail(id));
    return response.data;
  },

  create: async (data: CreateUserPayload): Promise<ApiResponse<AdminUser>> => {
    const payload = toUserCreatePayload(data);
    const response = await apiClient.post<ApiResponse<AdminUser>>(ENDPOINTS.users.create, payload);
    return response.data;
  },

  update: async (id: number | string, data: Partial<UpdateUserPayload>): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(
      ENDPOINTS.users.update(id),
      data
    );
    return response.data;
  },

  changeRole: async (id: number | string, role: UserRole): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(
      ENDPOINTS.users.changeRole(id),
      { role }
    );
    return response.data;
  },

  resetPassword: async (id: number | string, password: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      ENDPOINTS.users.resetPassword(id),
      { password }
    );
    return response.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.users.delete(id));
    return response.data;
  },
};
