import { PostFormData } from '../types/post.types';

export const INITIAL_POST_FORM_VALUES: PostFormData = {
  slug: '',
  title: { ar: '', en: '' },
  short_description: { ar: '', en: '' },
  content: { ar: '', en: '' },
  published_at: null,
  is_published: true,
};
