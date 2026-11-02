import { TranslatableField } from '@/api/types';

export interface MediaObject {
  id?: number;
  url?: string;
  file_path?: string;
  [key: string]: any;
}

export interface WorkStep {
  id: number;
  step_number: number;
  title: TranslatableField;
  description: TranslatableField;
  icon?: string | MediaObject | null;
  is_active: boolean;
}

export interface TeamMember {
  id: number;
  name: TranslatableField;
  job_title: TranslatableField;
  badge_text?: TranslatableField;
  image?: string | MediaObject | null;
  is_active: boolean;
  sort_order?: number;
}

export interface Testimonial {
  id: number;
  client_name: TranslatableField;
  client_job: TranslatableField;
  comment: TranslatableField;
  rating: number;
  is_active: boolean;
  avatar?: string | MediaObject | null;
  sort_order?: number;
}

export interface PageSection {
  id?: number;
  section_key?: string;
  slug?: string;
  title: TranslatableField;
  subtitle?: TranslatableField | null;
  description?: TranslatableField | null;
  image?: string | MediaObject | null;
  video_url?: string | null;
  is_active?: boolean;
}

export interface TeamMemberFormData {
  name: TranslatableField;
  job_title: TranslatableField;
  badge_text?: TranslatableField;
  is_active?: boolean;
  is_highlighted?: boolean;
  sort_order?: number;
  image?: File | null;
}

export interface WorkStepFormData {
  step_number?: number;
  title: TranslatableField;
  description: TranslatableField;
  is_active?: boolean;
  icon?: File | null;
}

export interface TestimonialFormData {
  client_name: TranslatableField;
  client_job?: TranslatableField;
  comment: TranslatableField;
  rating?: number;
  sort_order?: number;
  is_active?: boolean;
  client_image?: File | null;
}
