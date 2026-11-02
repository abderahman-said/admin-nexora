import { ProjectFormData, ProjectPart } from '../types/project.types';

export const DEFAULT_PART_TEMPLATE: ProjectPart = {
  type: 'website',
  title: { ar: 'الموقع الإلكتروني', en: 'Website' },
  description: { ar: '', en: '' },
  website_url: '',
  app_store_url: '',
  google_play_url: '',
  technologies: [],
  apps: [],
  images: [],
  newImageFiles: [],
};

export const INITIAL_PROJECT_FORM_VALUES: ProjectFormData = {
  service_id: '',
  slug: '',
  title: { ar: '', en: '' },
  description: { ar: '', en: '' },
  is_featured: false,
  is_active: true,
  sort_order: 1,
  parts: [DEFAULT_PART_TEMPLATE],
};
