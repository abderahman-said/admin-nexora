import { TranslatableField } from '@/api/types';

export interface Service {
  id: number;
  slug: string;
  title: TranslatableField;
  short_description: TranslatableField;
  full_description?: TranslatableField;
  icon?: string | null;
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
  is_active: boolean;
}
