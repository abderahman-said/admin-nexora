import { useNavigate } from 'react-router-dom';
import LoginPhotoPanel from '@/features/auth/LoginPhotoPanel';
import { LoginHeader } from '@/features/auth/Login/LoginHeader';
import { LoginForm } from '@/features/auth/Login/LoginForm';
import { useLogin } from '@/features/auth/hooks/useAuthMutations';
import { LoginCredentials } from '@/features/auth/types/auth.types';
import useAuthStore from '@/store/useAuthStore';
import useThemeStore from '@/store/useThemeStore';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from '@/api/client';
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { theme, toggleTheme } = useThemeStore();
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
    <div className="w-screen h-screen flex flex-col md:flex-row bg-background_main relative overflow-hidden" dir="rtl">
      {/* Theme toggle in top bar */}
      <button
        onClick={toggleTheme}
        aria-label="تبديل المظهر"
        className="absolute top-5 end-5 z-20 h-9 w-9 rounded-xl flex items-center justify-center border border-border bg-card/80 backdrop-blur-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
      >
        {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
      </button>

      <LoginPhotoPanel />

      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 md:p-14 max-w-[540px] mx-auto">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card">
          <LoginHeader />
          <LoginForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
