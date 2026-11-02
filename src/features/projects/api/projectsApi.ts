import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginationParams } from '@/api/types';
import { Project, ProjectFormData, ProjectPart } from '../types/project.types';
import { toKebabCase } from '@/lib/utils';

/**
 * Builds a FormData instance for Project Create / Update adhering to Laravel's bracket notation.
 */
export function buildProjectFormData(data: Partial<ProjectFormData>, isEdit = false): FormData {
  const fd = new FormData();

  if (isEdit) {
    fd.append('_method', 'PATCH');
  }

  // Only append valid numeric service_id
  if (data.service_id && Number(data.service_id) > 0) {
    fd.append('service_id', String(data.service_id));
  }

  if (!isEdit && data.slug) {
    const cleanSlug = toKebabCase(data.slug);
    if (cleanSlug) {
      fd.append('slug', cleanSlug);
    }
  }

  const titleAr = data.title?.ar?.trim() || '';
  const titleEn = data.title?.en?.trim() || titleAr;
  if (titleAr) {
    fd.append('title[ar]', titleAr);
    fd.append('title[en]', titleEn);
  }

  const descAr = data.description?.ar?.trim() || '';
  const descEn = data.description?.en?.trim() || descAr;
  if (descAr) {
    fd.append('description[ar]', descAr);
    fd.append('description[en]', descEn);
  }

  if (data.sort_order !== undefined && data.sort_order !== null) {
    fd.append('sort_order', String(Math.max(0, Number(data.sort_order))));
  }

  if (data.is_featured !== undefined) {
    fd.append('is_featured', data.is_featured ? '1' : '0');
  }

  if (data.is_active !== undefined) {
    fd.append('is_active', data.is_active ? '1' : '0');
  }

  if (data.cover_image instanceof File) {
    fd.append('image', data.cover_image);
  } else if ((data as any).remove_image) {
    fd.append('remove_image', '1');
  }

  // Helper to normalize URLs to valid https://
  const normalizeUrl = (url?: string | null): string => {
    if (!url || !url.trim()) return '';
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  };

  // Handle parts array
  if (data.parts && Array.isArray(data.parts) && data.parts.length > 0) {
    data.parts.forEach((part, pIdx) => {
      const pType = part.type || 'website';
      fd.append(`parts[${pIdx}][type]`, pType);

      const partTitleAr = part.title?.ar?.trim() || (pType === 'website' ? 'الموقع الإلكتروني' : 'تطبيق الهاتف');
      const partTitleEn = part.title?.en?.trim() || (pType === 'website' ? 'Website' : 'Mobile App');
      fd.append(`parts[${pIdx}][title][ar]`, partTitleAr);
      fd.append(`parts[${pIdx}][title][en]`, partTitleEn);

      const partDescAr = part.description?.ar?.trim() || '';
      const partDescEn = part.description?.en?.trim() || partDescAr;
      if (partDescAr) {
        fd.append(`parts[${pIdx}][description][ar]`, partDescAr);
        fd.append(`parts[${pIdx}][description][en]`, partDescEn);
      }

      const webUrl = normalizeUrl(part.website_url);
      if (webUrl) fd.append(`parts[${pIdx}][website_url]`, webUrl);

      const appStoreUrl = normalizeUrl(part.app_store_url);
      if (appStoreUrl) fd.append(`parts[${pIdx}][app_store_url]`, appStoreUrl);

      const playUrl = normalizeUrl(part.google_play_url);
      if (playUrl) fd.append(`parts[${pIdx}][google_play_url]`, playUrl);

      // Technologies (max 15 items)
      if (part.technologies && Array.isArray(part.technologies)) {
        part.technologies.slice(0, 15).forEach((tech, tIdx) => {
          if (tech && tech.trim()) {
            fd.append(`parts[${pIdx}][technologies][${tIdx}]`, tech.trim());
          }
        });
      }

      // Apps (for mobile apps)
      if (part.apps && Array.isArray(part.apps)) {
        let appCounter = 0;
        part.apps.forEach((app) => {
          const aTitleAr = app.title?.ar?.trim();
          if (aTitleAr) {
            const aTitleEn = app.title?.en?.trim() || aTitleAr;
            fd.append(`parts[${pIdx}][apps][${appCounter}][title][ar]`, aTitleAr);
            fd.append(`parts[${pIdx}][apps][${appCounter}][title][en]`, aTitleEn);

            const aDescAr = app.description?.ar?.trim() || '';
            const aDescEn = app.description?.en?.trim() || aDescAr;
            if (aDescAr) {
              fd.append(`parts[${pIdx}][apps][${appCounter}][description][ar]`, aDescAr);
              fd.append(`parts[${pIdx}][apps][${appCounter}][description][en]`, aDescEn);
            }
            appCounter++;
          }
        });
      }

      // Images: existing IDs or new Files
      let imgCounter = 0;
      if (part.images && Array.isArray(part.images)) {
        part.images.forEach((img) => {
          let idNum: number | null = null;
          if (typeof img === 'number' && !isNaN(img) && img > 0) {
            idNum = img;
          } else if (typeof img === 'object' && img !== null && 'id' in img && img.id) {
            const parsed = Number(img.id);
            if (!isNaN(parsed) && parsed > 0) idNum = parsed;
          } else if (typeof img === 'string') {
            const parsed = Number(img);
            if (!isNaN(parsed) && parsed > 0) idNum = parsed;
          }

          if (idNum !== null) {
            fd.append(`parts[${pIdx}][images][${imgCounter}]`, String(idNum));
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

import { validateDevPayload } from '@/lib/payloadUtils';

export function toProjectCreatePayload(data: ProjectFormData, coverFile?: File | null): FormData {
  const fd = buildProjectFormData({ ...data, cover_image: coverFile ?? data.cover_image }, false);
  validateDevPayload('Project Create', fd, [
    'slug',
    'title[ar]',
    'parts[0][type]',
    'parts[0][title][ar]',
  ]);
  return fd;
}

export function toProjectUpdatePayload(
  data: Partial<ProjectFormData>,
  coverFile?: File | null,
  allParts?: ProjectPart[]
): FormData | Partial<ProjectFormData> {
  const partsToSend = allParts || data.parts;
  const hasFiles =
    coverFile instanceof File ||
    data.cover_image instanceof File ||
    Boolean(partsToSend?.some((p) => p.newImageFiles && p.newImageFiles.length > 0)) ||
    Boolean(data.parts?.some((p) => p.newImageFiles && p.newImageFiles.length > 0));

  // If there are files OR if parts were submitted, use FormData with _method=PATCH
  // This guarantees proper array/bracket notation and handles image IDs and new files cleanly
  if (hasFiles || Boolean(partsToSend && partsToSend.length > 0)) {
    return buildProjectFormData(
      { ...data, parts: partsToSend, cover_image: coverFile ?? data.cover_image },
      true
    );
  }

  // If returning pure JSON, ensure any parts.images contains only integer IDs
  if (data.parts && Array.isArray(data.parts)) {
    const cleanedParts = data.parts.map((p) => ({
      ...p,
      images: (p.images || [])
        .map((img) => {
          if (typeof img === 'number') return img;
          if (typeof img === 'object' && img && 'id' in img && img.id) return Number(img.id);
          if (typeof img === 'string' && !isNaN(Number(img))) return Number(img);
          return null;
        })
        .filter((id): id is number => id !== null && id > 0),
    }));
    return { ...data, parts: cleanedParts };
  }

  return data;
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

  create: async (data: ProjectFormData | FormData, coverFile?: File | null): Promise<ApiResponse<Project>> => {
    const payload = data instanceof FormData ? data : toProjectCreatePayload(data, coverFile);
    const response = await apiClient.post<ApiResponse<Project>>(ENDPOINTS.projects.create, payload);
    return response.data;
  },

  update: async (
    id: number | string,
    data: Partial<ProjectFormData> | FormData,
    coverFile?: File | null,
    allParts?: ProjectPart[]
  ): Promise<ApiResponse<Project>> => {
    if (data instanceof FormData) {
      const response = await apiClient.post<ApiResponse<Project>>(
        ENDPOINTS.projects.update(id),
        data
      );
      return response.data;
    }

    const payload = toProjectUpdatePayload(data, coverFile, allParts);

    if (payload instanceof FormData) {
      const response = await apiClient.post<ApiResponse<Project>>(
        ENDPOINTS.projects.update(id),
        payload
      );
      return response.data;
    }

    // Pure JSON PATCH
    const response = await apiClient.patch<ApiResponse<Project>>(
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
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.projects.reorder,
      { ids }
    );
    return response.data;
  },
};
