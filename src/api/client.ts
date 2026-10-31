import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';
import { ApiErrorResponse } from './types';

export const AUTH_COOKIE_NAME = 'authToken';

const baseURL = import.meta.env.VITE_API_URL || 'https://basma-backend-production.up.railway.app/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If payload is FormData, do not enforce application/json
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    if (status === 401) {
      const isLoginRequest = error.config?.url?.includes('/admin/login') || window.location.pathname === '/login';
      if (isLoginRequest) {
        toast.error(errorData?.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
      } else {
        Cookies.remove(AUTH_COOKIE_NAME);
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        toast.error('انتهت الجلسة، يرجى تسجيل الدخول مجدداً');
      }
    } else if (status === 403) {
      toast.error(errorData?.message || 'ليس لديك صلاحية لتنفيذ هذا الإجراء');
    } else if (status === 422) {
      // Validation error - handle first message if available
      const errors = errorData?.errors;
      if (errors && Object.keys(errors).length > 0) {
        const firstKey = Object.keys(errors)[0];
        const firstMsg = errors[firstKey]?.[0];
        if (firstMsg) {
          toast.error(firstMsg);
        }
      } else {
        toast.error(errorData?.message || 'يرجى التأكد من صحة البيانات المدخلة');
      }
    } else if (status === 429) {
      toast.error('تم تجاوز الحد المسموح من الطلبات، يرجى الانتظار قليلاً');
    } else if (status && status >= 500) {
      toast.error('حدث خطأ في الخادم، يرجى المحاولة لاحقاً');
    } else if (!error.response) {
      toast.error('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت أو رابط الـ API');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
