import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import LoginPhotoPanel from '@/features/auth/LoginPhotoPanel';
import { LoginHeader } from '@/features/auth/Login/LoginHeader';
import { LoginForm } from '@/features/auth/Login/LoginForm';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface LoginResponse {
  data?: {
    accessToken?: string;
    token?: string;
    user?: any;
    requiresOTP?: boolean;
  };
  accessToken?: string;
  token?: string;
  user?: any;
  requiresOTP?: boolean;
  message?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: true,
    onSuccess: handleLoginSuccess,
    disableSuccessToast: true,
  });

  function handleLoginSuccess(response: LoginResponse) {
    const token = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
    const user = response?.data?.user || response?.user;
    const requiresOTP = response?.data?.requiresOTP || response?.requiresOTP || false;

    if (!token) return console.warn('No token received');

    Cookies.set('authToken', token, {
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });

    login({ user, token, requiresOTP });
    toast.success(response?.message || "تم تسجيل الدخول بنجاح");

    if (requiresOTP) {
      navigate('/otp');
    } else {
      navigate('/dashboard');
    }
  }

  const onSubmit = (data: any) => {
    // Demo bypass
    handleLoginSuccess({
      data: {
        accessToken: 'demo-token',
        user: { id: '1', name: 'Admin', email: data.email },
        requiresOTP: false,
      },
      message: 'تم تسجيل الدخول بنجاح (وضع تجريبي)'
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 max-w-[600px] mx-auto">
        <LoginHeader />
        <LoginForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
}
