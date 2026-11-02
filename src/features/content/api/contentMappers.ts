import { validateDevPayload, appendTranslatable, appendBoolean, appendPrimitive } from '@/lib/payloadUtils';
import {
  TeamMemberFormData,
  WorkStepFormData,
  TestimonialFormData,
} from '../types/content.types';

// ==========================================
// Team Member Mappers
// ==========================================
export function toTeamMemberCreatePayload(
  data: TeamMemberFormData,
  photoFile?: File | null
): FormData {
  const fd = new FormData();
  appendTranslatable(fd, 'name', data.name, { requiredAr: true });
  appendTranslatable(fd, 'job_title', data.job_title, { requiredAr: true });
  if (data.badge_text) {
    appendTranslatable(fd, 'badge_text', data.badge_text);
  }
  appendBoolean(fd, 'is_active', data.is_active ?? true);
  if (data.is_highlighted !== undefined) {
    appendBoolean(fd, 'is_highlighted', data.is_highlighted);
  }
  if (data.sort_order !== undefined) {
    appendPrimitive(fd, 'sort_order', data.sort_order);
  }
  const file = photoFile ?? data.image;
  if (file instanceof File) {
    fd.append('image', file);
  }

  validateDevPayload('Team Member Create', fd, ['name[ar]', 'job_title[ar]']);
  return fd;
}

export function toTeamMemberUpdatePayload(
  data: Partial<TeamMemberFormData>,
  photoFile?: File | null
): FormData {
  const fd = new FormData();
  fd.append('_method', 'PATCH');

  if (data.name) appendTranslatable(fd, 'name', data.name);
  if (data.job_title) appendTranslatable(fd, 'job_title', data.job_title);
  if (data.badge_text) appendTranslatable(fd, 'badge_text', data.badge_text);
  if (data.is_active !== undefined) appendBoolean(fd, 'is_active', data.is_active);
  if (data.is_highlighted !== undefined) appendBoolean(fd, 'is_highlighted', data.is_highlighted);
  if (data.sort_order !== undefined) appendPrimitive(fd, 'sort_order', data.sort_order);

  const file = photoFile ?? data.image;
  if (file instanceof File) {
    fd.append('image', file);
  }

  return fd;
}

// ==========================================
// Work Step Mappers
// ==========================================
export function toWorkStepCreatePayload(
  data: WorkStepFormData,
  iconFile?: File | null
): FormData | Record<string, unknown> {
  const file = iconFile ?? data.icon;
  if (file instanceof File) {
    const fd = new FormData();
    if (data.step_number !== undefined) appendPrimitive(fd, 'step_number', data.step_number);
    appendTranslatable(fd, 'title', data.title, { requiredAr: true });
    appendTranslatable(fd, 'description', data.description, { requiredAr: true });
    appendBoolean(fd, 'is_active', data.is_active ?? true);
    fd.append('icon', file);
    validateDevPayload('Work Step Create', fd, ['title[ar]', 'description[ar]']);
    return fd;
  }

  const payload: Record<string, unknown> = {
    title: data.title,
    description: data.description,
    is_active: data.is_active ?? true,
  };
  if (data.step_number !== undefined) {
    payload.step_number = data.step_number;
  }
  validateDevPayload('Work Step Create', payload, ['title', 'description']);
  return payload;
}

export function toWorkStepUpdatePayload(
  data: Partial<WorkStepFormData>,
  iconFile?: File | null
): FormData | Record<string, unknown> {
  const file = iconFile ?? data.icon;
  if (file instanceof File) {
    const fd = new FormData();
    fd.append('_method', 'PATCH');
    if (data.step_number !== undefined) appendPrimitive(fd, 'step_number', data.step_number);
    if (data.title) appendTranslatable(fd, 'title', data.title);
    if (data.description) appendTranslatable(fd, 'description', data.description);
    if (data.is_active !== undefined) appendBoolean(fd, 'is_active', data.is_active);
    fd.append('icon', file);
    return fd;
  }

  const payload: Record<string, unknown> = {};
  if (data.step_number !== undefined) payload.step_number = data.step_number;
  if (data.title) payload.title = data.title;
  if (data.description) payload.description = data.description;
  if (data.is_active !== undefined) payload.is_active = data.is_active;
  return payload;
}

// ==========================================
// Testimonial Mappers
// ==========================================
export function toTestimonialCreatePayload(
  data: TestimonialFormData,
  imageFile?: File | null
): FormData | Record<string, unknown> {
  const file = imageFile ?? data.client_image;
  if (file instanceof File) {
    const fd = new FormData();
    appendTranslatable(fd, 'client_name', data.client_name, { requiredAr: true });
    if (data.client_job) appendTranslatable(fd, 'client_job', data.client_job);
    appendTranslatable(fd, 'comment', data.comment, { requiredAr: true });
    if (data.rating !== undefined) appendPrimitive(fd, 'rating', data.rating);
    if (data.sort_order !== undefined) appendPrimitive(fd, 'sort_order', data.sort_order);
    appendBoolean(fd, 'is_active', data.is_active ?? true);
    fd.append('client_image', file);
    validateDevPayload('Testimonial Create', fd, ['client_name[ar]', 'comment[ar]']);
    return fd;
  }

  const payload: Record<string, unknown> = {
    client_name: data.client_name,
    comment: data.comment,
    is_active: data.is_active ?? true,
  };
  if (data.client_job && (data.client_job.ar || data.client_job.en)) {
    payload.client_job = data.client_job;
  }
  if (data.rating !== undefined) payload.rating = data.rating;
  if (data.sort_order !== undefined) payload.sort_order = data.sort_order;

  validateDevPayload('Testimonial Create', payload, ['client_name', 'comment']);
  return payload;
}

export function toTestimonialUpdatePayload(
  data: Partial<TestimonialFormData>,
  imageFile?: File | null
): FormData | Record<string, unknown> {
  const file = imageFile ?? data.client_image;
  if (file instanceof File) {
    const fd = new FormData();
    fd.append('_method', 'PATCH');
    if (data.client_name) appendTranslatable(fd, 'client_name', data.client_name);
    if (data.client_job) appendTranslatable(fd, 'client_job', data.client_job);
    if (data.comment) appendTranslatable(fd, 'comment', data.comment);
    if (data.rating !== undefined) appendPrimitive(fd, 'rating', data.rating);
    if (data.sort_order !== undefined) appendPrimitive(fd, 'sort_order', data.sort_order);
    if (data.is_active !== undefined) appendBoolean(fd, 'is_active', data.is_active);
    fd.append('client_image', file);
    return fd;
  }

  const payload: Record<string, unknown> = {};
  if (data.client_name) payload.client_name = data.client_name;
  if (data.client_job) payload.client_job = data.client_job;
  if (data.comment) payload.comment = data.comment;
  if (data.rating !== undefined) payload.rating = data.rating;
  if (data.sort_order !== undefined) payload.sort_order = data.sort_order;
  if (data.is_active !== undefined) payload.is_active = data.is_active;
  return payload;
}
