import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Post, PostFormData } from '../types/post.types';

/**
 * Builds Post payload handling multipart form data if an image file is attached.
 */
export function buildPostPayload(data: Partial<PostFormData>, isEdit = false): FormData | Record<string, unknown> {
  const hasFile = data.image instanceof File;

  // Resolve published_at:
  let publishedAt = data.published_at;
  if (data.is_published !== undefined) {
    if (data.is_published) {
      publishedAt = publishedAt || new Date().toISOString().replace('T', ' ').substring(0, 19);
    } else {
      publishedAt = null;
    }
  }

  if (!hasFile) {
    const jsonPayload: Record<string, unknown> = {};
    if (!isEdit && data.slug) jsonPayload.slug = data.slug;
    if (data.title) jsonPayload.title = data.title;
    if (data.short_description) jsonPayload.short_description = data.short_description;
    if (data.content) jsonPayload.content = data.content;
    if (publishedAt !== undefined) jsonPayload.published_at = publishedAt;
    return jsonPayload;
  }

  const fd = new FormData();
  if (isEdit) {
    fd.append('_method', 'PATCH');
  }

  if (!isEdit && data.slug) fd.append('slug', data.slug);
  if (data.title?.ar) fd.append('title[ar]', data.title.ar);
  if (data.title?.en) fd.append('title[en]', data.title.en);
  if (data.short_description?.ar) fd.append('short_description[ar]', data.short_description.ar);
  if (data.short_description?.en) fd.append('short_description[en]', data.short_description.en);
  if (data.content?.ar) fd.append('content[ar]', data.content.ar);
  if (data.content?.en) fd.append('content[en]', data.content.en);
  if (publishedAt) fd.append('published_at', publishedAt);
  if (data.image instanceof File) fd.append('image', data.image);

  return fd;
}

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
    const payload = data instanceof FormData ? data : buildPostPayload(data, false);
    const response = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.create, payload);
    return response.data;
  },

  update: async (id: number | string, data: Partial<PostFormData> | FormData): Promise<ApiResponse<Post>> => {
    if (data instanceof FormData) {
      const response = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.update(id), data);
      return response.data;
    }

    if (data.image instanceof File) {
      const fd = buildPostPayload(data, true);
      const response = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.update(id), fd);
      return response.data;
    }

    const payload = buildPostPayload(data, true);
    const response = await apiClient.patch<ApiResponse<Post>>(ENDPOINTS.posts.update(id), payload);
    return response.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.posts.delete(id));
    return response.data;
  },
};
