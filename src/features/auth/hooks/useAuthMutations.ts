import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import useAuthStore from '@/store/useAuthStore';
import { AUTH_COOKIE_NAME } from '@/api/client';
import { ChangePasswordPayload, LoginCredentials } from '../types/auth.types';

export const authKeys = {
  profile: ['auth', 'profile'] as const,
};

export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { token, user } = response.data;
      if (token) {
        Cookies.set(AUTH_COOKIE_NAME, token, {
          expires: 7,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
        });
        login({ user, token });
        toast.success(response.message || 'تم تسجيل الدخول بنجاح');
        navigate('/dashboard');
      }
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      Cookies.remove(AUTH_COOKIE_NAME);
      logout();
      queryClient.clear();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/login');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message || 'تم تغيير كلمة المرور بنجاح');
    },
  });
}
