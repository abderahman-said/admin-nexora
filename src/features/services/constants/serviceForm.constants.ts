import { ServiceFormData } from '../types/service.types';

export const INITIAL_SERVICE_FORM_VALUES: ServiceFormData = {
  slug: '',
  title: { ar: '', en: '' },
  short_description: { ar: '', en: '' },
  full_description: { ar: '', en: '' },
  is_featured: false,
  is_active: true,
  sort_order: 1,
  features: [],
};
