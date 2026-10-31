import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/api/types';
import { WorkStep, TeamMember, Testimonial, PageSection } from '../types/content.types';

export const contentApi = {
  // Work steps
  listWorkSteps: async (): Promise<ApiResponse<WorkStep[]>> => {
    const res = await apiClient.get<ApiResponse<WorkStep[]>>(ENDPOINTS.content.workSteps.list);
    return res.data;
  },
  createWorkStep: async (data: any): Promise<ApiResponse<WorkStep>> => {
    const res = await apiClient.post<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.create, data);
    return res.data;
  },
  updateWorkStep: async (id: number | string, data: any): Promise<ApiResponse<WorkStep>> => {
    const res = await apiClient.patch<ApiResponse<WorkStep>>(ENDPOINTS.content.workSteps.update(id), data);
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

  // Team members
  listTeamMembers: async (): Promise<ApiResponse<TeamMember[]>> => {
    const res = await apiClient.get<ApiResponse<TeamMember[]>>(ENDPOINTS.content.teamMembers.list);
    return res.data;
  },
  createTeamMember: async (data: any): Promise<ApiResponse<TeamMember>> => {
    const res = await apiClient.post<ApiResponse<TeamMember>>(ENDPOINTS.content.teamMembers.create, data);
    return res.data;
  },
  updateTeamMember: async (id: number | string, data: any): Promise<ApiResponse<TeamMember>> => {
    const res = await apiClient.post<ApiResponse<TeamMember>>(ENDPOINTS.content.teamMembers.update(id), data);
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

  // Testimonials
  listTestimonials: async (): Promise<ApiResponse<Testimonial[]>> => {
    const res = await apiClient.get<ApiResponse<Testimonial[]>>(ENDPOINTS.content.testimonials.list);
    return res.data;
  },
  createTestimonial: async (data: any): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.post<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.create, data);
    return res.data;
  },
  updateTestimonial: async (id: number | string, data: any): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.patch<ApiResponse<Testimonial>>(ENDPOINTS.content.testimonials.update(id), data);
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
