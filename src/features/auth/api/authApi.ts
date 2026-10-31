import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/api/types';
import { User, LoginCredentials, LoginData, ChangePasswordPayload } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginData>> => {
    const response = await apiClient.post<ApiResponse<LoginData>>(
      ENDPOINTS.auth.login,
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(ENDPOINTS.auth.logout);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.auth.profile);
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(
      ENDPOINTS.auth.changePassword,
      payload
    );
    return response.data;
  },
};
