import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/api/types';
import {
  WorkStep,
  TeamMember,
  Testimonial,
  PageSection,
  TeamMemberFormData,
  WorkStepFormData,
  TestimonialFormData,
} from '../types/content.types';
import {
  toTeamMemberCreatePayload,
  toTeamMemberUpdatePayload,
  toWorkStepCreatePayload,
  toWorkStepUpdatePayload,
  toTestimonialCreatePayload,
  toTestimonialUpdatePayload,
} from './contentMappers';

export const contentApi = {
  // Work steps
  listWorkSteps: async (): Promise<ApiResponse<WorkStep[]>> => {
    const res = await apiClient.get<ApiResponse<WorkStep[]>>(ENDPOINTS.content.workSteps.list);
    return res.data;
  },
  createWorkStep: async (
    data: WorkStepFormData | FormData,
    iconFile?: File | null
  ): Promise<ApiResponse<WorkStep>> => {
    const payload = data instanceof FormData ? data : toWorkStepCreatePayload(data, iconFile);
    const res = await apiClient.post<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.create, payload);
    return res.data;
  },
  updateWorkStep: async (
    id: number | string,
    data: Partial<WorkStepFormData> | FormData,
    iconFile?: File | null
  ): Promise<ApiResponse<WorkStep>> => {
    const payload = data instanceof FormData ? data : toWorkStepUpdatePayload(data, iconFile);
    if (payload instanceof FormData) {
      const res = await apiClient.post<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.update(id), payload);
      return res.data;
    }
    const res = await apiClient.patch<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.update(id), payload);
    return res.data;
  },
  getWorkStepById: async (id: number | string): Promise<ApiResponse<WorkStep>> => {
    const res = await apiClient.get<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.detail(id));
    return res.data;
  },
  deleteWorkStep: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.content.workSteps.delete(id));
    return res.data;
  },
  toggleWorkStep: async (id: number | string): Promise<ApiResponse<WorkStep>> => {
    const res = await apiClient.patch<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.toggle(id), { field: 'is_active' });
    return res.data;
  },
  reorderWorkSteps: async (ids: number[]): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>(ENDPOINTS.content.workSteps.reorder, { ids });
    return res.data;
  },

  // Team members
  listTeamMembers: async (): Promise<ApiResponse<TeamMember[]>> => {
    const res = await apiClient.get<ApiResponse<TeamMember[]>>(ENDPOINTS.content.teamMembers.list);
    return res.data;
  },
  createTeamMember: async (
    data: TeamMemberFormData | FormData,
    photoFile?: File | null
  ): Promise<ApiResponse<TeamMember>> => {
    const payload = data instanceof FormData ? data : toTeamMemberCreatePayload(data, photoFile);
    const res = await apiClient.post<ApiResponse<TeamMember>>(ENDPOINTS.content.teamMembers.create, payload);
    return res.data;
  },
  updateTeamMember: async (
    id: number | string,
    data: Partial<TeamMemberFormData> | FormData,
    photoFile?: File | null
  ): Promise<ApiResponse<TeamMember>> => {
    const payload = data instanceof FormData ? data : toTeamMemberUpdatePayload(data, photoFile);
    const res = await apiClient.post<ApiResponse<TeamMember>>(ENDPOINTS.content.teamMembers.update(id), payload);
    return res.data;
  },
  getTeamMemberById: async (id: number | string): Promise<ApiResponse<TeamMember>> => {
    const res = await apiClient.get<ApiResponse<TeamMember>>(ENDPOINTS.content.teamMembers.detail(id));
    return res.data;
  },
  deleteTeamMember: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.content.teamMembers.delete(id));
    return res.data;
  },
  toggleTeamMember: async (id: number | string): Promise<ApiResponse<TeamMember>> => {
    const res = await apiClient.patch<ApiResponse<TeamMember>>(ENDPOINTS.content.teamMembers.toggle(id), { field: 'is_active' });
    return res.data;
  },
  reorderTeamMembers: async (ids: number[]): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>(ENDPOINTS.content.teamMembers.reorder, { ids });
    return res.data;
  },

  // Testimonials
  listTestimonials: async (): Promise<ApiResponse<Testimonial[]>> => {
    const res = await apiClient.get<ApiResponse<Testimonial[]>>(ENDPOINTS.content.testimonials.list);
    return res.data;
  },
  createTestimonial: async (
    data: TestimonialFormData | FormData,
    imageFile?: File | null
  ): Promise<ApiResponse<Testimonial>> => {
    const payload = data instanceof FormData ? data : toTestimonialCreatePayload(data, imageFile);
    const res = await apiClient.post<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.create, payload);
    return res.data;
  },
  updateTestimonial: async (
    id: number | string,
    data: Partial<TestimonialFormData> | FormData,
    imageFile?: File | null
  ): Promise<ApiResponse<Testimonial>> => {
    const payload = data instanceof FormData ? data : toTestimonialUpdatePayload(data, imageFile);
    if (payload instanceof FormData) {
      const res = await apiClient.post<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.update(id), payload);
      return res.data;
    }
    const res = await apiClient.patch<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.update(id), payload);
    return res.data;
  },
  getTestimonialById: async (id: number | string): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.get<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.detail(id));
    return res.data;
  },
  deleteTestimonial: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(ENDPOINTS.content.testimonials.delete(id));
    return res.data;
  },
  toggleTestimonial: async (id: number | string): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.patch<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.toggle(id), { field: 'is_active' });
    return res.data;
  },
  reorderTestimonials: async (ids: number[]): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>(ENDPOINTS.content.testimonials.reorder, { ids });
    return res.data;
  },

  // Page sections
  listPageSections: async (): Promise<ApiResponse<PageSection[]>> => {
    const res = await apiClient.get<ApiResponse<PageSection[]>>(ENDPOINTS.content.pageSections.list);
    return res.data;
  },
  getPageSection: async (slug: string): Promise<ApiResponse<PageSection>> => {
    const res = await apiClient.get<ApiResponse<PageSection>>(ENDPOINTS.content.pageSections.detail(slug));
    return res.data;
  },
  updatePageSection: async (slug: string, data: any): Promise<ApiResponse<PageSection>> => {
    const res = await apiClient.post<ApiResponse<PageSection>>(ENDPOINTS.content.pageSections.update(slug), data);
    return res.data;
  },
};
