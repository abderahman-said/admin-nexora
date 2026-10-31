import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Post, PostFormData } from '../types/post.types';

export const postsApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get<ApiResponse<Post[]>>(ENDPOINTS.posts.list, {
      params,
    });
    return response.data;
  },

  getById: async (id: number | string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.get<ApiResponse<Post>>(ENDPOINTS.posts.detail(id));
    return response.data;
  },

  create: async (data: PostFormData | FormData): Promise<ApiResponse<Post>> => {
    let payload = data;
    if (!(data instanceof FormData)) {
      const fd = new FormData();
      fd.append('slug', data.slug);
      fd.append('title[ar]', data.title.ar);
      fd.append('title[en]', data.title.en);
      fd.append('short_description[ar]', data.short_description.ar);
      fd.append('short_description[en]', data.short_description.en);
      fd.append('content[ar]', data.content.ar);
      fd.append('content[en]', data.content.en);
      if (data.is_active !== undefined) fd.append('is_active', data.is_active ? '1' : '0');
      if (data.image) fd.append('image', data.image);
      payload = fd;
    }
    const response = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.create, payload);
    return response.data;
  },

  update: async (id: number | string, data: Partial<PostFormData> | FormData): Promise<ApiResponse<Post>> => {
    if (!(data instanceof FormData)) {
      const response = await apiClient.patch<ApiResponse<Post>>(ENDPOINTS.posts.update(id), data);
      return response.data;
    }
    const response = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.update(id), data);
    return response.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.posts.delete(id));
    return response.data;
  },
};
