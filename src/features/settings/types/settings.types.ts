import { TranslatableField } from '@/api/types';

export interface SiteSettings {
  id?: number;
  footer_description?: TranslatableField;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: TranslatableField;
  facebook_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  updated_at?: string;
}
