import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Project, ProjectFormData } from '../types/project.types';

export const projectsApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<Project[]>> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(ENDPOINTS.projects.list, {
      params,
    });
    return response.data;
  },

  getById: async (id: number | string): Promise<ApiResponse<Project>> => {
    const response = await apiClient.get<ApiResponse<Project>>(ENDPOINTS.projects.detail(id));
    return response.data;
  },

  create: async (data: ProjectFormData | FormData): Promise<ApiResponse<Project>> => {
    let payload = data;
    if (!(data instanceof FormData)) {
      const fd = new FormData();
      fd.append('service_id', String(data.service_id));
      fd.append('slug', data.slug);
      fd.append('title[ar]', data.title.ar);
      fd.append('title[en]', data.title.en);
      fd.append('description[ar]', data.description.ar);
      fd.append('description[en]', data.description.en);
      fd.append('is_featured', data.is_featured ? '1' : '0');
      fd.append('is_active', data.is_active ? '1' : '0');
      if (data.cover_image) {
        fd.append('cover_image', data.cover_image);
      }
      payload = fd;
    }
    const response = await apiClient.post<ApiResponse<Project>>(ENDPOINTS.projects.create, payload);
    return response.data;
  },

  update: async (id: number | string, data: Partial<ProjectFormData> | FormData): Promise<ApiResponse<Project>> => {
    let payload = data;
    if (!(data instanceof FormData)) {
      const fd = new FormData();
      fd.append('_method', 'PATCH');
      if (data.service_id) fd.append('service_id', String(data.service_id));
      if (data.slug) fd.append('slug', data.slug);
      if (data.title?.ar) fd.append('title[ar]', data.title.ar);
      if (data.title?.en) fd.append('title[en]', data.title.en);
      if (data.description?.ar) fd.append('description[ar]', data.description.ar);
      if (data.description?.en) fd.append('description[en]', data.description.en);
      if (data.is_featured !== undefined) fd.append('is_featured', data.is_featured ? '1' : '0');
      if (data.is_active !== undefined) fd.append('is_active', data.is_active ? '1' : '0');
      if (data.cover_image) {
        fd.append('cover_image', data.cover_image);
      }
      payload = fd;
    }
    const response = await apiClient.post<ApiResponse<Project>>(
      ENDPOINTS.projects.update(id),
      payload
    );
    return response.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.projects.delete(id));
    return response.data;
  },

  toggleField: async (id: number | string, field = 'is_active'): Promise<ApiResponse<Project>> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      ENDPOINTS.projects.toggle(id),
      { field }
    );
    return response.data;
  },

  reorder: async (ids: number[]): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(ENDPOINTS.projects.reorder, { ids });
    return response.data;
  },
};
