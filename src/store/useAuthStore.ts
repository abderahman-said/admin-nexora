import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  requiresOTP: boolean;
  pendingEmail: string | null;
  login: (data: { user: User; token: string; requiresOTP?: boolean }) => void;
  logout: () => void;
  setPendingEmail: (email: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      requiresOTP: false,
      pendingEmail: null,
      login: ({ user, token, requiresOTP }) => set({ isAuthenticated: true, user, token, requiresOTP: requiresOTP || false }),
      logout: () => set({ isAuthenticated: false, user: null, token: null, requiresOTP: false, pendingEmail: null }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        requiresOTP: state.requiresOTP,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
);

export default useAuthStore;
