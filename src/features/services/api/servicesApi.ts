import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Service, ServiceFormData } from '../types/service.types';

/**
 * Builds FormData for Service Create / Update to handle icon upload and bracket notation
 */
export function buildServicePayload(data: Partial<ServiceFormData>, isEdit = false): FormData | Record<string, unknown> {
  const hasFile = data.icon instanceof File;

  if (!hasFile) {
    const jsonPayload: Record<string, unknown> = {};
    if (!isEdit && data.slug) jsonPayload.slug = data.slug;
    if (data.title) jsonPayload.title = data.title;
    if (data.short_description) jsonPayload.short_description = data.short_description;
    if (data.full_description) jsonPayload.full_description = data.full_description;
    if (data.sort_order !== undefined) jsonPayload.sort_order = data.sort_order;
    if (data.is_featured !== undefined) jsonPayload.is_featured = Boolean(data.is_featured);
    if (data.is_active !== undefined) jsonPayload.is_active = Boolean(data.is_active);
    if (data.features) jsonPayload.features = data.features;
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
  if (data.full_description?.ar) fd.append('full_description[ar]', data.full_description.ar);
  if (data.full_description?.en) fd.append('full_description[en]', data.full_description.en);
  if (data.sort_order !== undefined) fd.append('sort_order', String(data.sort_order));
  if (data.is_featured !== undefined) fd.append('is_featured', data.is_featured ? '1' : '0');
  if (data.is_active !== undefined) fd.append('is_active', data.is_active ? '1' : '0');
  if (data.icon instanceof File) fd.append('icon', data.icon);

  if (data.features && Array.isArray(data.features)) {
    data.features.forEach((feat, fIdx) => {
      if (feat.title?.ar) fd.append(`features[${fIdx}][title][ar]`, feat.title.ar);
      if (feat.title?.en) fd.append(`features[${fIdx}][title][en]`, feat.title.en);
      if (feat.description?.ar) fd.append(`features[${fIdx}][description][ar]`, feat.description.ar);
      if (feat.description?.en) fd.append(`features[${fIdx}][description][en]`, feat.description.en);
    });
  }

  return fd;
}

export const servicesApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<Service[]>> => {
    const res = await apiClient.get<ApiResponse<Service[]>>(ENDPOINTS.services.list, {
      params,
    });
    return res.data;
  },

  getById: async (id: number | string): Promise<ApiResponse<Service>> => {
    const res = await apiClient.get<ApiResponse<Service>>(ENDPOINTS.services.detail(id));
    return res.data;
  },

  create: async (data: ServiceFormData | FormData): Promise<ApiResponse<Service>> => {
    const payload = data instanceof FormData ? data : buildServicePayload(data, false);
    const res = await apiClient.post<ApiResponse<Service>>(ENDPOINTS.services.create, payload);
    return res.data;
  },

  update: async (id: number | string, data: Partial<ServiceFormData> | FormData): Promise<ApiResponse<Service>> => {
    if (data instanceof FormData) {
      const res = await apiClient.post<ApiResponse<Service>>(ENDPOINTS.services.update(id), data);
      return res.data;
    }

    if (data.icon instanceof File) {
      const fd = buildServicePayload(data, true);
      const res = await apiClient.post<ApiResponse<Service>>(ENDPOINTS.services.update(id), fd);
      return res.data;
    }

    const res = await apiClient.patch<ApiResponse<Service>>(
      ENDPOINTS.services.update(id),
      buildServicePayload(data, true)
    );
    return res.data;
  },

  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.services.delete(id));
    return res.data;
  },

  toggleField: async (id: number | string, field = 'is_active'): Promise<ApiResponse<Service>> => {
    const res = await apiClient.patch<ApiResponse<Service>>(
      ENDPOINTS.services.toggle(id),
      { field }
    );
    return res.data;
  },

  reorder: async (ids: number[]): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.services.reorder,
      { ids }
    );
    return res.data;
  },
};
