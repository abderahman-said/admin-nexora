import { useNavigate } from 'react-router-dom';
import LoginPhotoPanel from '@/features/auth/LoginPhotoPanel';
import { LoginHeader } from '@/features/auth/Login/LoginHeader';
import { LoginForm } from '@/features/auth/Login/LoginForm';
import { useLogin } from '@/features/auth/hooks/useAuthMutations';
import { LoginCredentials } from '@/features/auth/types/auth.types';
import useAuthStore from '@/store/useAuthStore';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from '@/api/client';
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: login, isPending: loading } = useLogin();

  useEffect(() => {
    if (isAuthenticated && Cookies.get(AUTH_COOKIE_NAME)) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (credentials: LoginCredentials) => {
    login(credentials);
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card" dir="rtl">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 max-w-[600px] mx-auto">
        <LoginHeader />
        <LoginForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
