import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { ContactMessage, MessageStatus } from '../types/message.types';

export const messagesApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<ContactMessage[]>> => {
    const response = await apiClient.get<ApiResponse<ContactMessage[]>>(
      ENDPOINTS.messages.list,
      { params }
    );
    return response.data;
  },

  getById: async (id: number | string): Promise<ApiResponse<ContactMessage>> => {
    const response = await apiClient.get<ApiResponse<ContactMessage>>(
      ENDPOINTS.messages.detail(id)
    );
    return response.data;
  },

  updateStatus: async (id: number | string, status: MessageStatus): Promise<ApiResponse<ContactMessage>> => {
    const response = await apiClient.patch<ApiResponse<ContactMessage>>(
      ENDPOINTS.messages.updateStatus(id),
      { status }
    );
    return response.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.messages.delete(id));
    return response.data;
  },
};
