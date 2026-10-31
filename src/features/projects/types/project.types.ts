import { TranslatableField } from '@/api/types';
import { Service } from '@/features/services/types/service.types';

export interface ProjectPart {
  type: string;
  title: TranslatableField;
  description?: TranslatableField;
  website_url?: string;
  app_store_url?: string;
  google_play_url?: string;
  technologies?: string[];
  images?: string[];
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
  image?: string | null;
  service?: Service;
  parts?: ProjectPart[];
  created_at?: string;
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
}
