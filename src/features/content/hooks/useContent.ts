import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contentApi } from '../api/contentApi';

export const contentKeys = {
  workSteps: ['content', 'work-steps'] as const,
  teamMembers: ['content', 'team-members'] as const,
  testimonials: ['content', 'testimonials'] as const,
  pageSections: ['content', 'page-sections'] as const,
  pageSection: (slug: string) => ['content', 'page-sections', slug] as const,
};

// Work steps hooks
export function useWorkSteps() {
  return useQuery({
    queryKey: contentKeys.workSteps,
    queryFn: contentApi.listWorkSteps,
  });
}
export function useCreateWorkStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof contentApi.createWorkStep>[0]) =>
      contentApi.createWorkStep(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.workSteps });
      toast.success('تمت إضافة خطوة العمل بنجاح');
    },
  });
}
export function useUpdateWorkStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      contentApi.updateWorkStep(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.workSteps });
      toast.success('تم تعديل خطوة العمل بنجاح');
    },
  });
}
export function useDeleteWorkStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contentApi.deleteWorkStep,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.workSteps });
      toast.success('تم حذف خطوة العمل');
    },
  });
}
export function useToggleWorkStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contentApi.toggleWorkStep,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.workSteps });
      toast.success('تم تحديث حالة الخطوة');
    },
  });
}

// Team members hooks
export function useTeamMembers() {
  return useQuery({
    queryKey: contentKeys.teamMembers,
    queryFn: contentApi.listTeamMembers,
  });
}
export function useCreateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof contentApi.createTeamMember>[0]) =>
      contentApi.createTeamMember(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.teamMembers });
      toast.success('تمت إضافة عضو الفريق بنجاح');
    },
  });
}
export function useUpdateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      contentApi.updateTeamMember(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.teamMembers });
      toast.success('تم تعديل بيانات عضو الفريق');
    },
  });
}
export function useDeleteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contentApi.deleteTeamMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.teamMembers });
      toast.success('تم حذف عضو الفريق');
    },
  });
}
export function useToggleTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contentApi.toggleTeamMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.teamMembers });
      toast.success('تم تحديث حالة العضو');
    },
  });
}

// Testimonials hooks
export function useTestimonials() {
  return useQuery({
    queryKey: contentKeys.testimonials,
    queryFn: contentApi.listTestimonials,
  });
}
export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof contentApi.createTestimonial>[0]) =>
      contentApi.createTestimonial(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.testimonials });
      toast.success('تمت إضافة رأي العميل بنجاح');
    },
  });
}
export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      contentApi.updateTestimonial(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.testimonials });
      toast.success('تم تعديل رأي العميل بنجاح');
    },
  });
}
export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contentApi.deleteTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.testimonials });
      toast.success('تم حذف رأي العميل');
    },
  });
}
export function useToggleTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contentApi.toggleTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.testimonials });
      toast.success('تم تحديث حالة الرأي');
    },
  });
}

// Page sections hooks
export function usePageSections() {
  return useQuery({
    queryKey: contentKeys.pageSections,
    queryFn: contentApi.listPageSections,
  });
}
export function useUpdatePageSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: any }) =>
      contentApi.updatePageSection(slug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.pageSections });
      toast.success('تم حفظ تعديلات القسم بنجاح');
    },
  });
}
