import { TranslatableField } from '@/api/types';

export interface ServiceFeature {
  title: TranslatableField;
  description?: TranslatableField;
}

export interface Service {
  id: number;
  slug: string;
  title: TranslatableField;
  short_description: TranslatableField;
  full_description?: TranslatableField;
  icon?: { id?: number; url?: string } | string | null;
  features?: ServiceFeature[];
  is_featured?: boolean;
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  slug: string;
  title: TranslatableField;
  short_description: TranslatableField;
  full_description: TranslatableField;
  is_featured?: boolean;
  is_active: boolean;
  sort_order?: number;
  icon?: File | null;
  features?: ServiceFeature[];
}
