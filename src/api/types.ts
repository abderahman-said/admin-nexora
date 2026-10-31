export interface ApiResponse<T = any> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  meta?: PaginationMeta | null;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiErrorResponse {
  success: false;
  status_code: number;
  message: string;
  error_code?: string;
  errors?: Record<string, string[]> | null;
  meta?: {
    retry_after?: number;
  } | null;
}

export interface TranslatableField {
  ar: string;
  en: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  lang?: 'ar' | 'en';
  search?: string;
}
