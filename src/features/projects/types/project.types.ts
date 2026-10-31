import { TranslatableField } from '@/api/types';
import { Service } from '@/features/services/types/service.types';

export interface ProjectPartApp {
  title: TranslatableField;
  description?: TranslatableField;
}

export interface ProjectPartImage {
  id?: number;
  url?: string;
}

export interface ProjectPart {
  type: 'website' | 'mobile_app';
  title: TranslatableField;
  description?: TranslatableField;
  website_url?: string | null;
  app_store_url?: string | null;
  google_play_url?: string | null;
  technologies?: string[];
  apps?: ProjectPartApp[];
  images?: Array<ProjectPartImage | string | number>;
  // For client form handling
  newImageFiles?: File[];
}

export interface Project {
  id: number;
  service_id: number;
  slug: string;
  title: TranslatableField;
  description: TranslatableField;
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number;
  cover_image?: string | null;
  image?: { id: number; url: string } | string | null;
  service?: Service;
  parts?: ProjectPart[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectFormData {
  service_id: number | string;
  slug: string;
  title: TranslatableField;
  description: TranslatableField;
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number;
  cover_image?: File | null;
  parts: ProjectPart[];
}
