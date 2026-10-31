import { TranslatableField } from '@/api/types';

export interface Post {
  id: number;
  slug: string;
  title: TranslatableField;
  short_description?: TranslatableField | null;
  content: TranslatableField;
  image?: { id?: number; url?: string } | string | null;
  image_cover?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PostFormData {
  slug: string;
  title: TranslatableField;
  short_description: TranslatableField;
  content: TranslatableField;
  published_at?: string | null;
  is_published?: boolean;
  image?: File | null;
}
