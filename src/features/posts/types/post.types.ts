import { TranslatableField } from '@/api/types';

export interface Post {
  id: number;
  slug: string;
  title: TranslatableField;
  short_description: TranslatableField;
  content: TranslatableField;
  image?: string | null;
  image_cover?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PostFormData {
  slug: string;
  title: TranslatableField;
  short_description: TranslatableField;
  content: TranslatableField;
  is_active?: boolean;
  image?: File | null;
}
