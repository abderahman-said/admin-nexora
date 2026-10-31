import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Project, ProjectFormData } from '../types/project.types';

/**
 * Builds a FormData instance for Project Create / Update adhering to Laravel's bracket notation.
 */
export function buildProjectFormData(data: Partial<ProjectFormData>, isEdit = false): FormData {
  const fd = new FormData();

  if (isEdit) {
    fd.append('_method', 'PATCH');
  }

  if (data.service_id !== undefined && data.service_id !== null && data.service_id !== '') {
    fd.append('service_id', String(data.service_id));
  }

  if (!isEdit && data.slug) {
    fd.append('slug', data.slug);
  }

  if (data.title?.ar) fd.append('title[ar]', data.title.ar);
  if (data.title?.en) fd.append('title[en]', data.title.en);

  if (data.description?.ar !== undefined) fd.append('description[ar]', data.description.ar || '');
  if (data.description?.en !== undefined) fd.append('description[en]', data.description.en || '');

  if (data.sort_order !== undefined) {
    fd.append('sort_order', String(data.sort_order));
  }

  if (data.is_featured !== undefined) {
    fd.append('is_featured', data.is_featured ? '1' : '0');
  }

  if (data.is_active !== undefined) {
    fd.append('is_active', data.is_active ? '1' : '0');
  }

  if (data.cover_image instanceof File) {
    fd.append('image', data.cover_image);
  }

  // Handle parts array
  if (data.parts && Array.isArray(data.parts)) {
    data.parts.forEach((part, pIdx) => {
      fd.append(`parts[${pIdx}][type]`, part.type);
      fd.append(`parts[${pIdx}][title][ar]`, part.title?.ar || '');
      fd.append(`parts[${pIdx}][title][en]`, part.title?.en || '');

      if (part.description?.ar) {
        fd.append(`parts[${pIdx}][description][ar]`, part.description.ar);
      }
      if (part.description?.en) {
        fd.append(`parts[${pIdx}][description][en]`, part.description.en);
      }

      if (part.website_url) {
        fd.append(`parts[${pIdx}][website_url]`, part.website_url);
      }
      if (part.app_store_url) {
        fd.append(`parts[${pIdx}][app_store_url]`, part.app_store_url);
      }
      if (part.google_play_url) {
        fd.append(`parts[${pIdx}][google_play_url]`, part.google_play_url);
      }

      // Technologies
      if (part.technologies && Array.isArray(part.technologies)) {
        part.technologies.forEach((tech, tIdx) => {
          if (tech) {
            fd.append(`parts[${pIdx}][technologies][${tIdx}]`, tech);
          }
        });
      }

      // Apps (for mobile apps)
      if (part.apps && Array.isArray(part.apps)) {
        part.apps.forEach((app, aIdx) => {
          if (app.title?.ar) fd.append(`parts[${pIdx}][apps][${aIdx}][title][ar]`, app.title.ar);
          if (app.title?.en) fd.append(`parts[${pIdx}][apps][${aIdx}][title][en]`, app.title.en);
          if (app.description?.ar) fd.append(`parts[${pIdx}][apps][${aIdx}][description][ar]`, app.description.ar);
          if (app.description?.en) fd.append(`parts[${pIdx}][apps][${aIdx}][description][en]`, app.description.en);
        });
      }

      // Images: existing IDs or new Files
      let imgCounter = 0;
      if (part.images && Array.isArray(part.images)) {
        part.images.forEach((img) => {
          if (typeof img === 'number') {
            fd.append(`parts[${pIdx}][images][${imgCounter}]`, String(img));
            imgCounter++;
          } else if (typeof img === 'object' && img && 'id' in img && img.id) {
            fd.append(`parts[${pIdx}][images][${imgCounter}]`, String(img.id));
            imgCounter++;
          }
        });
      }

      // New files for this part
      if (part.newImageFiles && Array.isArray(part.newImageFiles)) {
        part.newImageFiles.forEach((file) => {
          if (file instanceof File) {
            fd.append(`parts[${pIdx}][images][${imgCounter}]`, file);
            imgCounter++;
          }
        });
      }
    });
  }

  return fd;
}

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
    const payload = data instanceof FormData ? data : buildProjectFormData(data, false);
    const response = await apiClient.post<ApiResponse<Project>>(ENDPOINTS.projects.create, payload);
    return response.data;
  },

  update: async (id: number | string, data: Partial<ProjectFormData> | FormData): Promise<ApiResponse<Project>> => {
    if (data instanceof FormData) {
      const response = await apiClient.post<ApiResponse<Project>>(
        ENDPOINTS.projects.update(id),
        data
      );
      return response.data;
    }

    // Check if we have files in parts or cover_image
    const hasFiles =
      data.cover_image instanceof File ||
      Boolean(data.parts?.some((p) => p.newImageFiles && p.newImageFiles.length > 0));

    if (hasFiles) {
      const fd = buildProjectFormData(data, true);
      const response = await apiClient.post<ApiResponse<Project>>(
        ENDPOINTS.projects.update(id),
        fd
      );
      return response.data;
    }

    // Pure JSON PATCH
    const response = await apiClient.patch<ApiResponse<Project>>(
      ENDPOINTS.projects.update(id),
      data
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
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.projects.reorder,
      { ids }
    );
    return response.data;
  },
};
